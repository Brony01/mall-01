import React, {Component} from 'react';
import LinkA from '../../components/link-a'

export default class extends Component {
    state = {
        params: {
            href: '123',
            target: '_black',
            text: 'Bronya Zaychik'
        }
    }

    render() {
        return (
            <div>
                {/*Made with ❤React and Node.js by <LinkA params={this.state.params}/>*/}
            </div>
        );
    }
}