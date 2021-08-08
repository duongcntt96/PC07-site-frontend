import React, { useState, useRef, useEffect } from 'react'
import { FaBars, FaTwitter } from 'react-icons/fa'
import { links, social } from './data'
import logo from './logo.jpg'

import Sidebar from './Sidebar';

const Navbar = () => {

  const [showLinks,setShowLinks] = useState(false)
  const [position,setPosition] = useState({})
  const [subLinks,setSubLinks] = useState({})

  const linksContainerRef = useRef(null)
  const linksRef = useRef(null)
  const sublinksRef = useRef(null)

  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height
    if (showLinks) 
      linksContainerRef.current.style.height = `${linksHeight}px`
    else
      linksContainerRef.current.style.height = '0px'
  },[showLinks])

  useEffect(() => {
    if (subLinks.children!=null){
      const sub = sublinksRef.current.getBoundingClientRect()
      sublinksRef.current.style.display = 'block'
      sublinksRef.current.style.left = position.center+'px'
      sublinksRef.current.style.top = position.bottom+'px'
    }
  },[position])

  const displaySubmenu = (e) => {
    const tmpPositon = e.target.getBoundingClientRect()
    const center = (tmpPositon.left + tmpPositon.right)  / 2
    const bottom = tmpPositon.bottom + 1
    const sublink = links.find(link => link.text===e.target.textContent)
    setPosition({center,bottom})
    setSubLinks(sublink)
  }
  const hiddenSubmenu = () => {
    sublinksRef.current.style.display = 'none'
  }

  return <nav>
    <div className="nav-center" onMouseOver={()=>hiddenSubmenu()}>
      <div className="nav-header" >
        <img className="logo" src={logo} alt="logo" />
        <button className="nav-toggle" onClick={()=>setShowLinks(!showLinks)}>
          <FaBars />
        </button>
      </div>

      <div className="links-container" ref={linksContainerRef}>
        <ul className="links" ref={linksRef}>
        {links.map(link => {
            const {id,url,text} = link;
            return <li key={id}>
            <a href={url} onMouseOver={(e) => displaySubmenu(e)}>{text}</a>
            </li>
        })}
        </ul>
      </div>

      <ul className="social-icons">
        {social.map(link => {
          const { id, url, icon } = link;
          return <li key={id}>
            <a href={url}>{icon}</a>
          </li>
        })}
      </ul>
    </div>

    <div className="sub-links" ref={sublinksRef}>
    {subLinks.children&&(
        <ul>
        {subLinks.children.map(link =>{
          return <li key={link.id}>
              <a href={link.url}>{link.text}</a>
            </li>
        })}
        </ul>
    )}
    </div>
  </nav>
}

export default Navbar
