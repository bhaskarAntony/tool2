import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './style.css'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
    const {user, isAthenticated} = useContext(AuthContext);
    console.log(user);
    const navigate = useNavigate();

    const logout = () =>{
      localStorage.removeItem('token');
    
      navigate('/login')
    }
    console.log(user.role);
    
    
  return (
    <header className='p-1'>
        <Navbar expand="lg" className="p-0">
      <Container fluid>
        <Navbar.Brand href="/"> <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_Karnataka.svg/800px-Seal_of_Karnataka.svg.png"
              alt="Seal of Karnataka"
            /></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className='h-100'>
          <Nav
            className="me-auto my-2 my-lg-0 h-100 gap-3"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/" className='bg-light h-100'>Home</Nav.Link>
          {
            user.role == 'super_admin'?(
              <>
                <NavDropdown title="Manage" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/a">Manage Arms</NavDropdown.Item>
              <NavDropdown.Item href="/am">Manage Ammunition</NavDropdown.Item>
              <NavDropdown.Item href="/manage/munition">Manage Munition</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/transactions" className='bg-light h-100'>Transactions</Nav.Link>
           
            <NavDropdown title="Manage Officers" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/fixed/officer">Fixed Officers</NavDropdown.Item>
              <NavDropdown.Item href="/duty/officer">Daily Duty Officers</NavDropdown.Item>
            </NavDropdown>
              </>
            ):(null)
          }

      <NavDropdown title="Issue" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/scanner">Scan and Issue</NavDropdown.Item>
              <NavDropdown.Item href="/issue">Mannual Issue</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/return" className='bg-light h-100'>Return</Nav.Link>
            <NavDropdown title="Maintanance Logs" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/maintanance">Create New log</NavDropdown.Item>
              <NavDropdown.Item href="/maintanance/logs">Manage Logs</NavDropdown.Item>
            </NavDropdown>
            {/* <NavDropdown title="Audit/Inspection" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/fixed/officer">Create New Audit log</NavDropdown.Item>
              <NavDropdown.Item href="/duty/officer">Manage Audit Logs</NavDropdown.Item>
            </NavDropdown> */}
            <Nav.Link href="/reports" className='bg-light h-100'>Reports</Nav.Link>
          </Nav>
        <div className='d-flex gap-3 align-items-center'>
      <div className='d-flex gap-2 rounded-pill  align-items-center border p-1 px-4 small'>
      <Avatar sx={{ bgcolor: deepPurple[500] }}>A</Avatar>
      <p className='mb-0 small'>{(user.role).toUpperCase()}</p>
      </div>
        <button className="red-btn" onClick={logout}>Logout</button>
        </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  );
}

export default Header;