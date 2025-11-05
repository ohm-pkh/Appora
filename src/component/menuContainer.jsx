import { useEffect, useState, useCallback } from "react";
import deleteSvg from '../assets/deleteSvg.svg'
import editSvg from '../assets/editSvg.svg'

export default function MenuContainer({ menu, deleteMenu, editMenu }) {
    const [preview, setPreview] = useState();

    const findPhoto = useCallback(async () => {
        console.log(menu);
        if (menu.photo) {
            console.log('photofound')
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(menu.photo);
        } else if (menu.photo_path && !menu.photo_path.startsWith('newMenu')) {
            console.log(menu.photo_path)
            console.log('path_found')
            setPreview(menu.photo_path);
        }
    }, [menu]);

    useEffect(() => {
        findPhoto();
    }, [findPhoto])
    return (
        <div className="menuContainer" style={{marginBottom:'1em'}}>
            <div className="menuPhoto">
                {preview ? (
                    <img
                        src={preview}
                        alt={menu.name + ' photo'}
                        className="circle-image"
                        style={{ width: "100%", height: "100%" }}
                    />
                ) : (
                    <div>Photo</div>
                )}
            </div>

            <div className="MenuInfo">
                <div className="namePrice">
                    <strong style={{width:'50%',height: '1em', marginBottom: '1em', }}>{menu.name}</strong>
                    <div style={{width:'50%',height: '1em', marginBottom: '1em' }}>Price: {menu.price} THB</div>
                </div>

                <div style={{ width: '100%', marginBottom: '1em', display: 'flex' }}>
                    Description:&nbsp;
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }} title={menu.description}>
                        {menu.description ?? 'None'}
                    </div>
                </div>
                <div style={{
                    width: '100%',
                    marginBottom: '1em',
                    display: 'flex'
                }}>
                    Category:&nbsp;
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }} title={menu?.category?.map(c => c.name).join(', ')}>
                        {menu?.category?.map(category => category.name).join(', ')}
                    </div>
                </div>
            </div>
            <div className="editDelete" >
                <div onClick={() => editMenu()} style={{ height: '50%', marginBottom: '0em' }}>
                    <img src={editSvg} alt="edit" style={{ width: '100%', cursor: 'pointer' }} />
                </div>
                <div onClick={()=>deleteMenu(menu.id)} style={{ height: '50%', marginBottom: '0em', placeContent: 'end' }}>
                    <img src={deleteSvg} alt="delete" style={{ width: '100%', cursor: 'pointer' }} />
                </div>
            </div>
        </div>
    )
}