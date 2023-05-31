import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App() {

    const [languages, setLanguages] = useState([]);
    const [translateFrom, translateFromHandler] = useState("af");
    const [translateTo, translateToHandler] = useState("af");
    const [translateText, translateTextHandler] = useState("");
    const [resultText, resultTextHandler] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("avaliableLanguages.json");
                const result = await response.json();
                setLanguages(result.data.languages);
            }
            catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleTranslateFromChange = (e) => {
        translateFromHandler(e.target.value);
    };

    const handleTranslateToChange = (e) => {
        translateToHandler(e.target.value);
    };

    const handleTranslateTextChange = (e) => {
        translateTextHandler(e.target.value);
    };

    const sendTranslationRequest = async () => {
        const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': 'your rapid-api key',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            body: new URLSearchParams({
                q: translateText,
                target: translateTo,
                source: translateFrom
            })
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            resultTextHandler(result.data.translations[0].translatedText);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <section className="translateFromBlock">
                <select name="translateFromLang" value={translateFrom} onChange={handleTranslateFromChange}>
                    {languages.map((languages) => (
                        <option key={languages.language} value={languages.language}>
                            {languages.name}
                        </option>
                    ))}
                </select>
                <textarea name="translateFromText" placeholder="Type here to translate" maxLength="500" value={translateText} onChange={handleTranslateTextChange}></textarea>
            </section>
            <section className="translateButtonBlock">
                <button onClick={sendTranslationRequest}>Translate</button>
            </section>
            <section className="translateToBlock">
                <select name="translateToLang" value={translateTo} onChange={handleTranslateToChange}>
                    {languages.map((languages) => (
                        <option key={languages.language} value={languages.language}>
                            {languages.name}
                        </option>
                    ))}
                </select>
                <textarea name="translateToText" value={resultText} readOnly></textarea>
            </section>
        </main>
    );
}
