import * as React from "react"
import { DBLiveClient } from "@dblive/client-js";

interface TicTacToeTileParams {
	column: number
	dbLive: DBLiveClient
	row: number
	value: string
	onTileClick: () => unknown
}

export class TicTacToeTileComponent extends React.Component<TicTacToeTileParams>
{
	private readonly onTileClick = () => this.props.onTileClick()

	render() {
		return (
			<div onClick={() => this.onTileClick()} className={`tic-tac-toe-tile ttt-col-${this.props.column} ttt-${this.props.value}`}>
				&nbsp;{this.props.value}&nbsp;
			</div>
		)
	}
}