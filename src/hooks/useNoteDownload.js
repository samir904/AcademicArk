// src/hooks/useNoteDownload.js
import { useDispatch, useSelector } from 'react-redux';
import ReactGA from 'react-ga4';
import { setLoginModal } from '../REDUX/Slices/authslice';
import { downloadnote } from '../REDUX/Slices/noteslice';
import { usePDFDownload } from './usePDFDownload';

export const useNoteDownload = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const { downloadPDF, downloading } = usePDFDownload();

  const triggerDownload = async (note) => {
    if (!note) return;

    if (!isLoggedIn) {
      dispatch(
        setLoginModal({
          isOpen: true,
          context: {
            action: 'want to Download this note',
            noteTitle: note.title,
          },
        })
      );
      return;
    }

    // Track event
    ReactGA.event({
      category: 'engagement',
      action: 'download_note',
      label: note.title,
      value: note._id,
    });

    // Increment download counter in backend
    dispatch(downloadnote({ noteId: note._id, title: note.title }));

    // Download to IndexedDB / local storage
    const success = await downloadPDF({
      id: note._id,
      url: note.fileDetails?.secure_url,
      title: note.title,
      subject: note.subject,
      courseCode: note.course,
      semester: note.semester,
      university: note.university,
      uploadedBy: note.uploadedBy,
    });

    return success;
  };

  return { triggerDownload, downloadingState: downloading };
};