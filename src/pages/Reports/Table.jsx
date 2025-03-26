import React from 'react'

function Table({data}) {
  return (
    <table width="100%" className="table">
            <thead>
              <tr className="main-btn">
                <th className="d-flex gap-2 align-items-center">
                 
                  Name
                </th>
                <th>Category</th>
                <th>Reg. no</th>
                <th>Coy</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td className='d-flex gap-2 align-ietms-center'>
                     
                      {item.type}
                    </td>
                    <td>{item.category.toUpperCase()}</td>
                    <td>{item.registerNumber}</td>
                    <td>{item.coy}</td>
                    {/* <td className="text-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-dark p-0">
                          <i className="bi bi-gear-fill" style={{ cursor: 'pointer' }}></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={()=>openCanvasHandler('edit', item._id)}>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={()=>handleDelete(item._id)}>Delete</Dropdown.Item>
                          <Dropdown.Item  onClick={()=>openCanvasHandler('view', item._id)}>View Details</Dropdown.Item>
                          <Dropdown.Item>History</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No weapons found.
                  </td>
                </tr>
              )}
            </tbody>
        </table>
  )
}

export default Table