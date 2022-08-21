import React from 'react';
import UserContext from '../lib/user-context';
import ProfileAchievements from '../components/profile-achievements';
import ProfileFriends from '../components/profile-friends';
import ProfilePosts from '../components/profile-posts';
import VisitorAchievements from '../components/visitor-achievements';
import VisitorPosts from '../components/visitor-posts';
import ProfileHeader from '../components/profile-header';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    // window.addEventListener('hashchange', () => {
    //   console.log('hashchange');
    //   console.log(parseInt(this.context.route.params.get('userId')) === this.state.userSite);
    //   this.getGames();
    // });
    this.state = {
      navOpen: 'initial',
      shadowOn: false,
      tab: 'posts',
      posts: true,
      friends: false,
      achievements: false,
      userSite: null,
      games: null,
      visitorGames: null
    };
    this.handleClickPosts = this.handleClickPosts.bind(this);
    this.handleClickFriends = this.handleClickFriends.bind(this);
    this.handleClickAchievements = this.handleClickAchievements.bind(this);
    this.getGames = this.getGames.bind(this);
  }

  componentDidMount() {
    this.getGames();
    window.addEventListener('hashchange', () => {
      this.getGames();
    });
  }

  getGames() {
    const params = this.context.params;
    const tokenJSON = localStorage.getItem('token');
    let userId = -1;
    // console.log('profile get games');
    if (this.context.user !== null) {
      userId = this.context.user.userId;
    }
    if (userId === params) {
      fetch('/api/achievements', {
        method: 'GET',
        headers: {
          'X-Access-Token': tokenJSON
        }
      })
        .then(response => response.json()
          .then(data => {
            const games = {
              userId: params,
              games: data
            };
            this.setState({
              games: data,
              visitorGames: games
            });
          })
        );
    } else {
      fetch(`/api/visitorData/${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json()
          .then(data => {
            const games = {
              userId: params,
              games: data
            };
            this.setState({ visitorGames: games });
          })
        );
    }
  }

  handleClickPosts() {
    this.setState({
      tab: 'posts',
      posts: true,
      friends: false,
      achievements: false
    });
  }

  handleClickFriends() {
    this.setState({
      tab: 'friends',
      posts: false,
      friends: true,
      achievements: false
    });
  }

  handleClickAchievements() {
    this.setState({
      tab: 'achievements',
      posts: false,
      friends: false,
      achievements: true
    });
  }

  render() {
    const params = this.context.params;
    let userId = -1;
    if (this.context.user !== null) {
      userId = this.context.user.userId;
    }
    if (userId === params) {
      let tabRender = <ProfilePosts />;
      if (this.state.tab === 'friends') {
        tabRender = <ProfileFriends />;
      }
      if (this.state.tab === 'achievements') {
        tabRender = <ProfileAchievements games={this.state.games} />;
      }
      return (
        <>
          <ProfileHeader />
          <ul className='profile-nav'>
            <li className={`profile-nav-link active-${this.state.posts}`} onClick={this.handleClickPosts}>Posts</li>
            <div className='profile-vertical-line'></div>
            <li className={`profile-nav-link active-${this.state.friends}`} onClick={this.handleClickFriends}>Friends</li>
            <div className='profile-vertical-line'></div>
            <li className={`profile-nav-link active-${this.state.achievements}`} onClick={this.handleClickAchievements}>Achievements</li>
          </ul>
          {tabRender}
        </>
      );
    } else {
      let tabRender = <VisitorPosts />;
      if (this.state.tab === 'achievements') {
        tabRender = <VisitorAchievements games={this.state.visitorGames} />;
      }
      return (
        <>
          <ProfileHeader />
          <ul className='profile-nav'>
            <li className={`profile-nav-link active-${this.state.posts}`} onClick={this.handleClickPosts}>Posts</li>
            <div className='profile-vertical-line'></div>
            <li className={`profile-nav-link active-${this.state.achievements}`} onClick={this.handleClickAchievements}>Achievements</li>
          </ul>
          {tabRender}
        </>
      );
    }
  }
}

Profile.contextType = UserContext;
