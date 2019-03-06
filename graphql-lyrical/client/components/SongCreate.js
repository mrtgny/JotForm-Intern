import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo'
import { Link, hashHistory } from 'react-router'
import fetchSongs from '../queries/fetchSong';

class SongCreate extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { title: "" }
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        console.log("e", e)
        e.preventDefault();
        const { mutate } = this.props;
        const { title } = this.state;

        mutate({
            variables: { title },
            refetchQueries: [{ query: fetchSongs }]
        }).then(() => hashHistory.push("/"))

    }

    render() {
        return (
            <div>
                <Link to="/">Back</Link>
                <h3>Create a New Song</h3>
                <form onSubmit={this.onSubmit}>
                    <label>Song Title:</label>
                    <input type="text" onChange={e => this.setState({ title: e.target.value })} value={this.state.title} />
                    <button>Save</button>
                </form>
            </div>
        );
    }
}

const mutation = gql`
    mutation AddSong($title: String){
        addSong(title: $title) {
            id
            title
        }
    }
`;

export default graphql(mutation)(SongCreate);
