import { useState } from 'react';

export const useImageUpload = (setForm, setSnackbar, setUploadProgress, setUploadStatuses) => {
  const handleImageUpload = async (e, key) => {
    const files = [...e.target.files];
    if (!files.length) return;

    const initialStatuses = files.map(file => ({
      file,
      status: 'pending',
      url: null,
      error: null,
    }));
    setUploadStatuses(prev => [...prev, ...initialStatuses]);

    let successCount = 0;
    let completedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);

      setUploadStatuses(prev =>
        prev.map((s, idx) =>
          idx === prev.length - files.length + i ? { ...s, status: 'uploading' } : s
        )
      );

      try {
        const res = await fetch(
          'https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39',
          { method: 'POST', body: formData }
        );
        const data = await res.json();

        if (data.data?.url) {
          setForm(prev => ({
            ...prev,
            [key]: [...prev[key], data.data.url],
          }));
          setUploadStatuses(prev =>
            prev.map((s, idx) =>
              idx === prev.length - files.length + i
                ? { ...s, status: 'success', url: data.data.url }
                : s
            )
          );
          successCount++;
          completedCount++;
          setUploadProgress((completedCount / files.length) * 100);
          setSnackbar({
            open: true,
            message: `Image ${successCount} of ${files.length} uploaded`,
            severity: 'success',
          });
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        setUploadStatuses(prev =>
          prev.map((s, idx) =>
            idx === prev.length - files.length + i
              ? { ...s, status: 'error', error: `Failed to upload ${file.name}` }
              : s
          )
        );
        completedCount++;
        setUploadProgress((completedCount / files.length) * 100);
        setSnackbar({
          open: true,
          message: `Failed to upload image ${file.name}`,
          severity: 'error',
        });
      }
    }

    if (successCount === 0 && completedCount > 0) {
      setSnackbar({ open: true, message: 'No images were uploaded', severity: 'error' });
    }

    setTimeout(() => {
      setUploadProgress(0);
      setUploadStatuses(prev => prev.filter(s => s.status === 'success'));
    }, 1000);
  };

  const handleImageSelect = (e) => {
    handleImageUpload(e, 'gallery');
  };

  return {
    handleImageSelect,
    handleImageUpload,
  };
};
