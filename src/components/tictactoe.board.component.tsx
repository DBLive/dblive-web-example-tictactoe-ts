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
	winningTiles?: boolean[][]
}

export class TicTacToeBoardComponent extends React.Component<TicTacToeBoardComponentParams, TicTacToeBoardComponentState>
{
	private keyListener!: DBLiveKeyEventListener<TicTacToeJsonExample>
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
				nextMove: xCount > oCount ? "O" : "X",
				winningTiles: this.checkForWin(board),
			})
		})
	}

	componentWillUnmount() {
		this.keyListener.listening = false
	}

	render() {
		const board = this.state.board,
			winningTiles = this.state.winningTiles

		return (
			<React.Fragment>
				<button className="new-game-button" onClick={() => this.onNewGameClicked()}>New Game</button>
				<div className="tic-tac-toe-board-container">
					<div className="tic-tac-toe-board">
						{board.map((row, rowIndex) =>
							<div key={`row-${rowIndex}`} className={`row ttt-row-${rowIndex}`}>
								{row.map((value, columnIndex) =>
									<TicTacToeTileComponent
										column={columnIndex}
										dbLive={this.dbLive}
										key={`tile-${rowIndex}-${columnIndex}`}
										onTileClick={() => this.onTileClicked(rowIndex, columnIndex)}
										row={rowIndex}
										value={value}
										winLoss={winningTiles && winningTiles[rowIndex][columnIndex]}
									/>
								)}
							</div>
						)}
					</div>
				</div>
			</React.Fragment>
		)
	}

	private checkForWin(board: TicTacToeBoard): boolean[][]|undefined {
		let winningTiles: boolean[][]|undefined

		for (let row = 0; row < 3; row++) {
			if (
				(board[row][0] === "X" || board[row][0] === "O") &&
				board[row][1] === board[row][0] &&
				board[row][2] === board[row][0]
			) {
				winningTiles = []

				for (let tileRow = 0; tileRow < 3; tileRow++) {
					winningTiles.push([])
					
					for (let tileCol = 0; tileCol < 3; tileCol++) {
						winningTiles[tileRow].push(tileRow === row)
					}
				}

				return winningTiles
			}
		}

		for (let col = 0; col < 3; col++) {
			if (
				(board[0][col] === "X" || board[0][col] === "O") &&
				board[1][col] === board[0][col] &&
				board[2][col] === board[0][col]
			) {
				winningTiles = []

				for (let tileRow = 0; tileRow < 3; tileRow++) {
					winningTiles.push([])
					
					for (let tileCol = 0; tileCol < 3; tileCol++) {
						winningTiles[tileRow].push(tileCol === col)
					}
				}

				return winningTiles
			}
		}

		if (
			(board[0][0] === "X" || board[0][0] === "O") &&
			board[1][1] === board[0][0] &&
			board[2][2] === board[0][0]
		) {
			winningTiles = []

			for (let tileRow = 0; tileRow < 3; tileRow++) {
				winningTiles.push([])
				
				for (let tileCol = 0; tileCol < 3; tileCol++) {
					winningTiles[tileRow].push(tileCol === tileRow)
				}
			}

			return winningTiles
		}
		
		if (
			(board[0][2] === "X" || board[0][2] === "O") &&
			board[1][1] === board[0][2] &&
			board[2][0] === board[0][2]
		) {
			winningTiles = []

			for (let tileRow = 0; tileRow < 3; tileRow++) {
				winningTiles.push([])
				
				for (let tileCol = 0; tileCol < 3; tileCol++) {
					winningTiles[tileRow].push(tileCol === (2 - tileRow))
				}
			}

			return winningTiles
		}

		return undefined
	}

	private onNewGameClicked(): void {
		this.dbLive.set("tic-tac-toe-example", {
			board: [
				[" ", " ", " "],
				[" ", " ", " "],
				[" ", " ", " "],
			]
		})
	}

	private onTileClicked(row: number, column: number): void {
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