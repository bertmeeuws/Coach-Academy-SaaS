import React from 'react'

export default function Questionnaire({name, onChange}) {
    return (
        <form onChange={onChange}>

                    <input type="radio" id="1" name={name} value="1"></input>
                    <input type="radio" id="2" name={name} value="2"></input>
                    <input type="radio" id="3" name={name} value="3"></input>
                    <input type="radio" id="4" name={name} value="4"></input>
                    <input type="radio" id="5" name={name} value="5"></input>
        </form>
    )
}
