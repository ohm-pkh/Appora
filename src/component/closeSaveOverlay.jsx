export function CloseBtn(onClose) {
  return (
    <button onClick={onClose}>Close</button>
  )
}

// closeSaveOverlay.jsx
export function SaveBtn(onSave, onClose, data, error = false) {
  async function save() {
    try {
      // if onSave returns false, don't close
      const result = await onSave(data);
      if (result === false) return;

      // if there's a known error string (like form error), don't close
      if (error) return;

      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (e) {
      console.error("Save error:", e);
      // do not close on error
    }
  }

  return (
    <button onClick={save}>Save</button>
  );
}



export default function OverlayBtn(params) {
  return (
    <div
      style={{
        marginTop: "1em",
        display: "flex",
        gap: "1.5em",
        justifyContent: "end",
        width: "100%",
      }}
    >
      {CloseBtn(params.onClose)}
      {SaveBtn(params.onSave, params.onClose, params.data, params.error)}
    </div>
  );
}
