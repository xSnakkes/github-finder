import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';


type SearchUserType = {
  login: string,
  id: number,
}
type SearchResult = {
  items: SearchUserType[],
}
type UserType = {
  login: string,
  id: number,
  avatar_url: string,
  followers: number,
  name: string,
  public_repos: number,
  bio: string,
}

function App() {
  const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null);
  const [userDetails, setUserDetails] = useState<null | UserType>(null)
  const [users, setUsers] = useState<SearchUserType[]>([])
  const [tempSearch, setTempsearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (selectedUser) {
      console.log('sync')
      document.title = selectedUser.login
    }
  }, [selectedUser])
  useEffect(() => {
    axios
      .get<SearchResult>(`https://api.github.com/search/users?q=${searchTerm}`)
      .then(res => {
        setUsers(res.data.items)
      })
  }, [searchTerm])

  useEffect(() => {
    if (!!selectedUser) {
      axios
        .get<UserType>(`https://api.github.com/users/${selectedUser.login}`)
        .then(res => {
          setUserDetails(res.data)
        })
    }
  }, [selectedUser])


  return (
    <div className="wrapper">
      <div className="find__container">
        <div className="find__input">
          <input type="text" placeholder="search"
            value={tempSearch}
            onChange={e => {
              setTempsearch(e.currentTarget.value)
            }} />
          <button className="find__button"
            onClick={() => {
              setSearchTerm(tempSearch)
            }}>
            find
          </button>
        </div>
        <div className="find__output">
          <div className="github__list">Users:</div>
          <ul className='find__users'>
            {users.map(u =>
              <li
                key={u.id}
                className={selectedUser === u ? 'selected' : 'find__user'}
                onClick={() => {
                  setSelectedUser(u)
                }}>{u.login}
              </li>)}
          </ul>
        </div>
      </div>
      <div className="user__details">
        {userDetails &&
          <div className="user__container">
            <div className="user__img">
              <img src={userDetails.avatar_url} alt="" />
            </div>
            <h2 className="user__header">Username: {userDetails.login}</h2>
            <div className="user__followers">Bio : {userDetails.bio}</div>
            <div className="user__followers">Followers : {userDetails.followers}</div>
            <div className="user__followers">Full Name : {userDetails.name}</div>
            <div className="user__followers">Number of repositories : {userDetails.public_repos}</div>
            <button className="user__visit" onClick={() => {
              window.open(`https://github.com/${userDetails.login}`)
            }}>
              Visit github page
            </button>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
