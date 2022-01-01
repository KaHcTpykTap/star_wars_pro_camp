import React, {useEffect, useState} from 'react';
import './App.css';
import {People, Planets, Vehicles} from "swapi-ts";
import BarChat from "./components/BarChat";

function App() {

    const [loading, setLoading] = useState<boolean>(false);
    const [max, setMax] = useState<number>(0);
    const [nameVehicle, setNameVehicle] = useState<string>('No name');
    const [arrWorldPopulation, setArrWorldPopulation] = useState<any[]>([]);
    const [namesPilots, setNamesPilots] = useState<string[]>([]);
    const [dataBar, setDataBar] = useState<any[]>([]);


    const getSumPopulation = async (pilots: any) => {
        let sum = 0;
        for (let pilot of pilots) {
            const rem = await People.find(p => p.url === pilot);
            const people = rem.resources[0].value;
            const res = await Planets.find(p => p.url === people.homeworld)
            const data = res.resources[0].value;
            const number = !isNaN(Number(data.population)) ? +data.population : 0;
            sum += number;
            if (pilots.length > 1) {
                const rem = arrWorldPopulation;
                const item = {
                    name: data.name,
                    population: !isNaN(Number(data.population)) ? +data.population : 'unknown'
                }
                rem.findIndex((iter) => iter.name === item.name) === -1 && rem.push(item);
                setArrWorldPopulation(rem);
                const names = namesPilots;
                names.findIndex((elem) => elem === people.name) === -1 && names.push(people.name);
                setNamesPilots(names);
            }
        }
        return sum;
    }

    const fetchData = async () => {
        const planets = await Planets.findBySearch(['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']);
        for (let item of planets.resources) {
            const rem = dataBar;
            const barItem = {name: item.value.name, expense: +item.value.population/10000000};
            dataBar.push(barItem);
            setDataBar(rem);
        }

        const data = await Vehicles.find(vehicle => vehicle.pilots.length > 0);
        const arrVehicles = data.resources;
        for (let item of arrVehicles) {
            const rem = await getSumPopulation(item.value.pilots);
            if (rem > max) {
                setMax(rem);
                setNameVehicle(item.value.name);
            }
        }
        return true;
    }

    useEffect(() => {
        fetchData().then(r => setLoading(r));
    }, []);

    return (

        <div className='App'>
            {loading ?
                <>
                    <div className='task1'>
                        <table width='80%'>
                            <tbody>
                            <tr>
                                <td>Vehicle name with the largest sum</td>
                                <td>{nameVehicle}</td>
                            </tr>
                            <tr>
                                <td>Related home planets and their respective population</td>
                                <td className="related">
                                    {arrWorldPopulation.map((item, idx) =>
                                        (<div
                                            key={idx}>{`${item.name} -> ${item.population}`}
                                        </div>))}
                                </td>
                            </tr>
                            <tr>
                                <td>Related pilot names</td>
                                <td>
                                    {namesPilots.map((item, idx) => (<div key={idx}>{item}</div>))}
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                    <BarChat data={dataBar}/>
                </>
                :
                <div>Loading...</div>
            }
        </div>
    )
}

export default App;
