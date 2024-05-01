import React from 'react'
import Sidebar from '../../components/Sidebar'
import Chat from '../../components/Chat/Chat'

import "./messenger.scss"
const Messenger = () => {
  return (
    <div className='home'>
        <Sidebar/>
        <Chat/>
    </div>
  )
}

export default Messenger