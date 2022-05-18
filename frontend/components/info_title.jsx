import { h, render, Component } from 'preact';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';

@connect(storeKeys)
export default class InfoTitle extends Component {
	state = {
		description_style: { display: 'none' }
	};

	toggle_tips = _ => {
		const { description_style } = this.state;
		this.setState({
			description_style: Object.keys(description_style).length === 0 ? { display: 'none' } : {}
		});
	};

	render({ title, description }, { description_style }) {
		return (
			<div style={{ marginBottom: '1.5rem' }}>
				<h1 className='subtitle is-4' style={{ marginBottom: '2rem' }} align='left'>
					{ title }
					{description &&
						<a class='has-text-black' onClick={ () => this.toggle_tips() }>
							<span class='icon is-large'>
								<i class='fas fa-info'></i>
							</span>
						</a>
					}
				</h1>
				<article class="message" style={ description_style }>
					<div class="message-body" style={{ marginTop: '-2rem', whiteSpace: 'pre-line' }}>
						{description}
					</div>
				</article>
			</div>
		);
	}
}
