import * as React from "react"
import { DBLiveClient, DBLiveLogger, DBLiveLoggerLevel } from "@dblive/client-js"
import { TicTacToeBoardComponent } from "./components/tictactoe.board.component"

DBLiveLogger.logLevel = DBLiveLoggerLevel.debug

export class App extends React.Component
{
	private dbLive = new DBLiveClient("+EzwYKZrXI7eKn/KRtlhURsGsjyP2e+1++vqTDQH")

	render() {
        return (
			<div className="app">
				<TicTacToeBoardComponent dbLive={this.dbLive} />
			</div>
		)
    }
}