import * as React from "react"
import { DBLiveClient, DBLiveLogger, DBLiveLoggerLevel } from "@dblive/client-js"
import { TicTacToeBoardComponent } from "./components/tictactoe.board.component"

DBLiveLogger.logLevel = DBLiveLoggerLevel.debug

export class App extends React.Component
{
	private readonly dbLive = new DBLiveClient("RGvQkjiSrmsBRLuiKJmYgghNO/Xsn7ONH1M5ZO/N")

	render() {
		return (
			<div className="app">
				<h1>Tic-Tac-Toe</h1>
				<TicTacToeBoardComponent dbLive={this.dbLive} />
			</div>
		)
	}
}