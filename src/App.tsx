import * as React from "react"
import { DBLiveClient } from "@dblive/client-js"
import { TicTacToeBoardComponent } from "./components/tictactoe.board.component"

export class App extends React.Component
{
	private dbLive = new DBLiveClient("+EzwYKZrXI7eKn/KRtlhURsGsjyP2e+1++vqTDQH")

	render() {
        return (
			<div className="app">
				<h1>DBLive Example</h1>
				<TicTacToeBoardComponent dbLive={this.dbLive} />
			</div>
		)
    }
}