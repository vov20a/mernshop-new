import React from 'react'
import useAuth from '../hooks/useAuth'
import { Col, Container, Row, Table } from 'react-bootstrap'

const AccountPage = () => {
    const { username, email, status, avatarUrl } = useAuth()
    return (
        <Container>
            <Row>
                <Col md={12}>
                    <div className="container">
                        <div className=" login-right">
                            <h3>User's information</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Avatar</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><img width='50px' src={avatarUrl} alt='avatar' /></td>
                                        <td>{username}</td>
                                        <td>{email}</td>
                                        <td>{status}</td>
                                    </tr>
                                </tbody>
                            </Table>

                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default AccountPage