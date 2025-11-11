import { useState,useEffect } from "react";

export default function ToggleSwitch({initStatus,onSwitch}) {
    const [isChecked,SetIsChecked] = useState(false);
    useEffect(()=>{
        SetIsChecked(initStatus);
    }
    ,[initStatus])

    function handleChange(){
        SetIsChecked(!isChecked);
        onSwitch();
    }
    return (
        <>
            <style>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 3em;
                    height: 1.5em;
                }

                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: 0.2s;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 1.3em;
                    width: 1.3em;
                    left: 0.1em;
                    bottom: 0.1em;
                    background-color: white;
                    transition: 0.2s;
                }

                input:checked + .slider {
                    background-color: #2196F3;
                }

                input:focus + .slider {
                    box-shadow: 0 0 1px #2196F3;
                }

                input:checked + .slider:before {
                    transform: translateX(1.5em);
                }

                /* Rounded sliders */
                .slider.round {
                    border-radius: 34px;
                }

                .slider.round:before {
                    border-radius: 50%;
                }
            `}</style>

            <label className="switch">
                <input type="checkbox" checked={isChecked} onChange={()=>handleChange()}/>
                <span className="slider round"></span>
            </label>
        </>
    );
}
