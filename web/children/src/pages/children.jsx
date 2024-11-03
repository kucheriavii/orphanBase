import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const AdoptChildren = () => {
    const [children, setChildren] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/adopt_children.csv'); // Шлях до CSV файлу
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const text = await response.text(); // Отримуємо текст безпосередньо
                // console.log(text)
                Papa.parse(text, {
                    header: true,
                    complete: (results) => {
    
                        const formattedData = results.data.map((child) => (  {                         
                            name: child['childName'],
                            age: child['age'],
                            gender: child['sex'],
                            hasSiblings: child['siblings_ammount'],
                            photo: child['photo_url']?child['photo_url'].slice(3):"",
                            invalid: child['invalid'],
                            id: child["id"]

                        }));
                        setChildren(formattedData);
                    },
                    error: (err) => {
                        setError(err.message); // Зберігаємо повідомлення про помилку
                    }
                });
            } catch (error) {
                setError(error.message); // Зберігаємо повідомлення про помилку
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Діти на усиновлення</h1>
            {error && <p style={{ color: 'red' }}>Помилка: {error}</p>} {/* Виводимо повідомлення про помилку */}
            <ul className="child-list">

                {children.map((child, index) => (     
                    <li key={index} className='child-item'>
                         <p className='child-info'>{child.name} - {child.age} років - {child.gender} Інвалідність - {child.invalid}  --- id {child.id}</p>
                        <p className="hasSiblings"><span>Братів та сестер - </span>{child.hasSiblings}</p>
                        <img src={"https://www.msp.gov.ua/" + child.photo} alt="child" className='child-img'/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdoptChildren;
