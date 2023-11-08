import React, { useState, useEffect } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaCommentDots } from 'react-icons/fa';
import { useGroupsStore } from '../hooks/useGroupsStore';
import { useDispatch, useSelector } from 'react-redux';

export const LikeAndCommentComponent = ({ idPublication, group }) => {
  const [showAreaComments, setShowAreaComments] = useState(false);
  const [commentValue, setCommentValue] = useState(''); // Agrega un estado para el valor del comentario
  const { createComment } = useGroupsStore();
  const { socket } = useSelector((state) => state.socket);

  const handleComment = () => {
    const data = {
      publication: idPublication,
      text: commentValue,
    };

    const data2 = {
      idPublication,
      group,
    };

    console.log(data);
    createComment(data);
    setCommentValue('');

    setTimeout(() => {
      socket.emit('nuevo-comentario', data2);
    }, 5000);
  };

  useEffect(() => {
    // Escucha el evento 'nueva-publicacion' y muestra los datos en la consola
    socket.on('nuevo-comentario-publicacion', (data) => {
      console.log('Nueva comentario recibido recibida:', data);

      // dispatch(createCommentStore(data.comments));
    });

    return () => {
      // Limpia la escucha del evento cuando el componente se desmonta
      socket.off('nuevo-comentario-publicacion');
    };
  }, [socket]);

  return (
    <div>
      <div className="flex items-center justify-between space-x-2 mt-5">
        <div className="flex space-x-3">
          <AiFillHeart className="w-6 h-6 cursor-pointer hover:text-purple-700 transition-colors" />
        </div>
        <div className="flex space-x-3 hover:text-purple-700 transition-colors">
          <button
            onClick={() => setShowAreaComments(!showAreaComments)}
            className="flex text-md font-medium transition-colors"
          >
            <FaCommentDots className="w-5 h-5 cursor-pointer mr-2" />
            Comentar
          </button>
        </div>
      </div>
      <div>
        {showAreaComments ? (
          <div className="flex flex-col justify-end items-end">
            <textarea
              className="w-full bg-neutral-900 rounded-lg mt-5 resize-none h-28 focus:outline-none focus:ring-0"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)} // Actualiza el estado del valor del comentario
            ></textarea>
            <button
              onClick={handleComment} // Llama a 'handleComment' cuando se hace clic en el botón
              className="bg-purple-800 rounded-lg px-4 py-2 mt-2 font-semibold hover:bg-purple-900 transition-colors"
            >
              Crear comentario
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
