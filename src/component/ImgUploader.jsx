import React, { useRef, useState, useEffect } from "react";
import "../style/ImageInput.css"; // import the CSS file

export default function ImageInput({ initialSrc = null, size = 120, onChange = null, alt = "profile image", disabled = false,circular=true }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(initialSrc);
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        setPreview(initialSrc);
    }, [initialSrc]);

    function openFilePicker() {
        if (disabled) return;
        inputRef.current?.click();
    }

    function handleFile(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
            if (typeof onChange === "function") onChange(file, reader.result);
        };
        reader.readAsDataURL(file);
    }

    function clearImage(e) {
        e.stopPropagation();
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
        if (typeof onChange === "function") onChange(null, null);
    }

    return (
        <div className="circular-image-wrapper" style={{borderRadius:circular?'50%':'10%'}}>
            <div
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openFilePicker();
                }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={`circle-container ${disabled ? "disabled" : ""}`}
                style={{ width: size, height: size, borderRadius:circular?'50%':'10%' }}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt={alt}
                        className="circle-image"
                        style={{ width: "100%", height: "100%" }}
                    />
                ) : (
                    <div className="placeholder">Photo</div>
                )}

                {/* Hover overlay */}
                {!disabled && (
                    <div
                        className="hover-overlay"
                        style={{ opacity: isHover ? 1 : 0 }}
                    >
                        Change
                    </div>
                )}

                {/* Clear button */}
                {preview && !disabled && (
                    <button className="clear-button" onClick={clearImage}>
                        &times;
                    </button>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                style={{ display: "none" }}
                disabled={disabled}
            />
        </div>
    );
}


export function Image({ initialSrc = null, size = 120, alt = "profile image",circular=true }) {
    const [preview, setPreview] = useState(initialSrc);

    useEffect(() => {
        setPreview(initialSrc);
    }, [initialSrc]);



    return (
        <div className="circular-image-wrapper" style={{borderRadius:circular?'50%':'10%'}}>
            <div
                role="button"
                tabIndex={0}
                className={`circle-container`}
                style={{ width: size, height: size, borderRadius:circular?'50%':'10%' }}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt={alt}
                        className="circle-image"
                        style={{ width: "100%", height: "100%" }}
                    />
                ) : (
                    <div className="placeholder">Photo</div>
                )}
            </div>
        </div>
    );
}
