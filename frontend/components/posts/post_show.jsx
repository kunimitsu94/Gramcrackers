import React from 'react';
import { Link } from 'react-router-dom';
import Comment from '../comments/comment';
import CommentIndexItem from '../comments/comment_index_item';
import Likes from '../likes/likes';
import Loader from 'react-loader-spinner'
class PostShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        const postId = this.props.match.params.id;
        this.props.fetchPost(postId)
            .then( () => this.props.fetchOwner(this.props.posts[postId].user_id))
            .then( () => this.props.fetchComments(postId))
            .then( () => this.props.fetchLikes(postId, "all"))
            .then( () => this.setState({loaded: true}))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({ loaded: false })
            this.props.fetchUserPosts(this.props.match.params.username)
                .then( () => this.props.fetchComments(postId))
                .then( () => this.props.fetchLikes(postId, "all"))
                .then( () => this.setState({ loaded: true }))
        }
    }

    render () {

        const postId = this.props.match.params.id;

        if (!this.props.posts[postId]) return null;

        if (!this.state.loaded) return <Loader type="Grid" color="rgb(98, 150, 209)" className="loading" />
        let ops = this.props.currentUser && this.props.currentUser.id === this.props.posts[postId].user_id ? 
            <div className="post-options" onClick={() => this.props.postOptionsModal('postoptions', this.props.match.params.id)}> <img src="./three-dots-more-indicator.png" width="15" height="15"/></div>
            : <div className="post-options"></div>;

        const profilePic = this.props.owner.photoUrl ? 
            <img className="profile-pic-small" src={this.props.owner.photoUrl}/> : 
            <img className="profile-pic-small" src="/user.png" />

        const comments = Object.values(this.props.comments)
        
        const postPhoto = this.props.posts[postId].photoUrl;

        const postCaption = this.props.posts[postId].caption
        
        return (
            <div className="post-show-wrap">
            <div className="post-show-main">
                <div className="post-show-row">
                    <div className="post-photo-container">
                        <img src={postPhoto} className="post-show-img"/>
                    </div>
                    <div className="post-show-right">
                        <div>
                                <div className="post-show-user">
                                    {profilePic}
                                <Link className="username" to={`/${this.props.owner.username}`}><p>{this.props.owner.username} </p></Link>
                                    {ops}
                                </div>
                                <div className="post-show-comments">
                                   
                                    <ul className="comments-ul">
                                    <div className="owner-caption">
                                            <span> <Link className="username" to={`/${this.props.owner.username}`}>{this.props.owner.username}</Link> 
                                            {postCaption}</span>
                                    </div>
                                        {
                                            comments.map ( comment => (
                                                <CommentIndexItem 
                                                comment={comment} 
                                                currentUser={this.props.currentUser} 
                                                commentOptionsModal={this.props.commentOptionsModal}
                                                postUser={this.props.posts[postId].user_id}
                                                key={comment.id}
                                                />
                                            ))
                                        }
                                    </ul>
                                </div>
                        </div>
                        <div>
                            <Likes
                            postId={postId}
                            fetchLikes={this.props.fetchLikes}
                            addLike={this.props.addLike}
                            removeLike={this.props.removeLike}
                            likes={this.props.likes}
                            currentUser={this.props.currentUser}
                            post={this.props.posts}
                            />
                        </div>
                            <Comment 
                            postId={postId} 
                            currentUser={this.props.currentUser}
                            addComment={this.props.addComment}
                            fetchPost={this.props.fetchPost}
                            />
                    </div>
                </div>
            </div>
            </div>
            
        )
    }
}

export default PostShow;