import React, { useState } from 'react'
import API from '../helpers/API'
import { useFetch } from '../hooks'
import { notify } from '../helpers/Notify'
import { useAuthAccess } from '../contexts/AuthContext'

export default function SinglePost(props) {
    const { id } = props?.match.params

    const [doCheck, setDoCheck] = useState(false)
    const [btnName, setBtnName] = useState("Enable editing")
    const { response, isLoading } = useFetch(props.match.params.id)
    const { auth } = useAuthAccess()

    const enableUpdate = () => {
        setDoCheck(!doCheck)
        doCheck ? setBtnName("Enable editing") : setBtnName("Disable editing")
    }
    React.useEffect(() => {
        document.getElementById('editor').contentEditable = doCheck;
        document.getElementById('editor2').contentEditable = doCheck;
    }, [doCheck])


    const updatePost = async (e) => {
        e.preventDefault()
        try {
            let title = document.getElementById('editor').innerHTML
            let body = document.getElementById('editor2').innerHTML

            const config = { headers: { "Content-Type": "application/json" } };
            const bodys = { title, body };
            const res = await API.patch(`/posts/${id}`, bodys, config)

            notify({ error: res.data.error, msg: res.data.message })

        } catch (e) {
            console.log(e);
            notify({ error: "Server error" + e })
        }
    }

    const handleDelete = async (id) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const res = await API.delete(`/posts/${id}`, config)
            notify({ error: res.data.error, msg: res.data.message })
            props.history.push('/')
        } catch (e) {
            console.log(e);
            notify({ error: "Server error" + e })
        }
    }

    return (
        <div className="container pt-2">
            <div className="row pt-2">
                {auth && <div className="col-md-12 d-flex justify-content-between">
                    <button className="btn btn-outline-dark d-flex align-items-center" onClick={enableUpdate}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                        </svg>
                        {btnName}
                    </button>
                    {doCheck && <button className="btn btn-outline-primary d-flex align-items-center" onClick={updatePost}>Save changes <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-cursor" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52 2.25 8.184z" />
                    </svg></button>}
                    <button className="btn btn-outline-danger d-flex align-items-center" onClick={() => handleDelete(id)}>Delete Post <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                    </svg></button>
                </div>
                }
                <div className="row mt-5">
                    <div className="col-md-12">
                        <h1 className="mb-5 p-2" id="editor" dangerouslySetInnerHTML={{ __html: response?.data.data.title }} />
                        <p id="editor2" className=" p-2" dangerouslySetInnerHTML={{ __html: response?.data.data.body }} />
                        <hr />
                        <span>{response?.data.data.author.name } | </span>
                        <span>{response?.data.data.author.lastName }|</span>
                        <span>{response?.data.data.author.email }</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
