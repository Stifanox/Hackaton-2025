import React from 'react';
import type { Rectangle } from '../common/types/Rectangle.ts';


type Props = {
    rect: Rectangle;
    index: number;
    scaleFactor: number;
    toggleSelection: (index: number) => void;
    onContextMenu: (e: React.MouseEvent, index: number) => void;
    onMouseMove: (e: React.MouseEvent, index: number) => void;
    onMouseLeave: () => void;
};

const Panel: React.FC<Props> = ({
                                    rect,
                                    index,
                                    scaleFactor,
                                    toggleSelection,
                                    onContextMenu,
                                    onMouseMove,
                                    onMouseLeave,
                                }) => {
    // const {data,error,execute} = useApiRequest((data:ProfileQueryParams)=> {
    //     return action_get_profile_data(data)
    // })

    return (
        <div
            onClick={() => {

                toggleSelection(index)
            }}
            onContextMenu={(e) => onContextMenu(e, index)}
            onMouseMove={(e) => onMouseMove(e, index)}
            onMouseLeave={onMouseLeave}
            style={{
                position: 'absolute',
                left: rect.x * scaleFactor,
                top: rect.y * scaleFactor,
                width: 1 * scaleFactor,
                height: 2 * scaleFactor,
                backgroundImage: `url('/solar.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #333',
                opacity: rect.selected ? 1 : 0.6,

                cursor: 'pointer',
            }}
        />
    );
};

export default Panel;
