import * as React from "react"
import { DBLiveClient } from "@dblive/client-js"

interface TicTacToeTileParams {
	column: number
	dbLive: DBLiveClient
	onTileClick: () => unknown
	row: number
	value: string
	winLoss?: boolean
}

export class TicTacToeTileComponent extends React.Component<TicTacToeTileParams>
{
	render() {
		const classNames = [
			"tic-tac-toe-tile",
			`ttt-col-${this.props.column}`,
			`ttt-${this.props.value}`,
		]

		if (this.props.winLoss !== undefined) {
			classNames.push(this.props.winLoss ? "ttt-win" : "ttt-loss")
		}

		let value = this.props.value

		if (value !== "X" && value !== "O") {
			value = ""
		}
		
		return (
			<div onClick={() => this.onTileClick()} className={classNames.join(" ")}>
				{value || "\u00A0"}
			</div>
		)
	}

	private onTileClick() {
		if (this.props.winLoss === undefined) {
			this.props.onTileClick()
		}
	}
}