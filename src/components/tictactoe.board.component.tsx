import * as React from "react"
import { DBLiveClient, DBLiveKeyEventListener } from "@dblive/client-js"
import { TicTacToeBoard } from "../common/tictactoe.board"
import { TicTacToeJsonExample } from "../common/tictactoe.jsonexample"
import { TicTacToeTileComponent } from "./tictactoe.tile.component"

interface TicTacToeBoardComponentParams {
	dbLive: DBLiveClient
}

interface TicTacToeBoardComponentState {
	board: TicTacToeBoard
	nextMove: "X"|"O"|" "
}

export class TicTacToeBoardComponent extends React.Component<TicTacToeBoardComponentParams, TicTacToeBoardComponentState>
{
	private keyListener!: DBLiveKeyEventListener
	private readonly dbLive = this.props.dbLive

	state: TicTacToeBoardComponentState = {
		board: [],
		nextMove: " ",
	}

	componentDidMount() {
		this.keyListener = this.dbLive.getJsonAndListen<TicTacToeJsonExample>("tic-tac-toe-example", value => {
			const board = (value.value && value.value.board) || []

			let xCount = 0,
				oCount = 0

			for (let row = 0; row < 3; row++) {
				if (board.length <= row) {
					board.push([])
				}

				for (let column = 0; column < 3; column++) {
					const tileValue = ((column <= board[row].length && board[row][column]) || " ").toUpperCase()
					board[row][column] = tileValue

					if (tileValue === "X") {
						xCount++
					}
					else if (tileValue === "O") {
						oCount++
					}
				}
			}

			this.setState({
				board,
				nextMove: xCount > oCount ? "O" : "X"
			})
		})
	}

	componentWillUnmount() {
		this.keyListener.listening = false
	}

	render() {
		const board = this.state.board

		return (
			<React.Fragment>
				<button className="new-game-button" onClick={() => this.onNewGameClicked()}>New Game</button>
				<div className="tic-tac-toe-board-container">
					<div className="tic-tac-toe-board">
						{board.map((row, rowIndex) =>
							<div key={`row-${rowIndex}`} className={`row ttt-row-${rowIndex}`}>
								{row.map((value, columnIndex) =>
									<TicTacToeTileComponent key={`tile-${rowIndex}-${columnIndex}`} column={columnIndex} dbLive={this.dbLive} row={rowIndex} value={value} onTileClick={() => this.onTileClicked(rowIndex, columnIndex)} />
								)}
							</div>
						)}
					</div>
				</div>
			</React.Fragment>
		)
	}

	private onNewGameClicked() {
		this.dbLive.set("tic-tac-toe-example", {
			board: [
				[" ", " ", " "],
				[" ", " ", " "],
				[" ", " ", " "],
			]
		})
	}

	private onTileClicked(row: number, column: number) {
		const board = this.state.board,
			nextMove = this.state.nextMove

		if (nextMove === " ")
			return

		if (row < board.length && column < board[row].length) {
			const value = board[row][column].toUpperCase()

			if (value !== "X" && value !== "O") {
				board[row][column] = nextMove
				
				this.dbLive.set("tic-tac-toe-example", {
					board
				})
			}
		}
	}
}