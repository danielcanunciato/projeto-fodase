import React, { useState, useEffect } from "react";
import axios from "axios";

import './index.css';

export default function HomePage() {

    const [backendData, setBackendData] = useState(null);

    const refreshData = async () => {
        try {
            const resp = await axios.get('http://localhost:1830/idiota-api/coisas');
            setBackendData(resp.data);
        } catch (error) {
            console.error("Error fetching backend data:", error);
        }
    }

    const clearData = async () => {
        try {
            const resp = await axios.delete('http://localhost:1830/idiota-api/apagar_coisas');
            refreshData();
        } catch (error) {
            console.error("Error clearing backend data:", error);
        }
    }

    useEffect(() => {
        refreshData();
    }, [backendData])

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmitInfo = async (info) => {
        try {
            const resp = await axios.post(`http://localhost:1830/idiota-api/coisas/${info}`);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    }

    const enterKey = (e) => {
        if (e.key === "Enter") {
            setShowSuccess(true);
            handleSubmitInfo(e.target.value);
            e.target.value = "";
            refreshData();
            console.log('entered')
        }
    }

    const keyChanging = (e) => {
        return setShowSuccess(false);
    }

    return (
        <>
        
            <main style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#282c34'}}>
                
                <h3 style={{color: 'lime', position: 'fixed', transform: 'translateY(-260px)', display: showSuccess !== true && 'none'}}>Sucesso!</h3>

                <h1 style={{color: `white`}}>Armazenador de Coisas Aleatórias 2000</h1>
                <small><p style={{color: 'lightgray'}}>Aperte [ENTER] para inserir.</p></small>

                <input onChange={keyChanging} onKeyDown={enterKey} type="text" name="doenca" placeholder="Escreva sua Coisa" />

                <h4 style={{color: 'white', textAlign: 'center', textDecoration: 'underline', marginTop: '20px', marginBottom: '-30px'}}> Coisas Aleatórias </h4>

                <div style={{marginTop: '40px', width: '600px', height: '200px', overflowY: 'scroll'}}>
                    {backendData && backendData.map((key, ind) => (
                        <p key={ind} style={{color: 'gold', textAlign: 'center', lineHeight: '0.5'}}>{key.data}</p>
                    ))}
                </div>     

                <button onClick={clearData} style={{marginTop: '20px'}}>Clear Data</button>
                
            </main>       
        </>
    )
}