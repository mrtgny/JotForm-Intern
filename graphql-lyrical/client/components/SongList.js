import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import fetchSongs from '../queries/fetchSong';

class SongList extends Component {

    constructor(props) {
        super(props);
        this.renderSongs = this.renderSongs.bind(this)
    }

    renderSongs() {
        const { data: { songs } } = this.props
        return songs.map((song, index) => {
            return (
                <li className="collection-item" key={index}>
                    {song.title}
                </li>
            )
        })
    }

    render() {
        console.log(this.props);
        const { data: { loading } } = this.props;
        if (loading)
            return <div>LOADING</div>

        return (
            <div>
                <ul className="collection">
                    {this.renderSongs()}
                </ul>
                <Link to={"songs/new"} className="btn-floating btn-large red right">
                    <i className="material-icons">add</i>
                </Link>
            </div>
        );
    }
}


export default graphql(fetchSongs)(SongList);
