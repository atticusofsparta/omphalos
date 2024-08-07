import { OmphalosProject } from '@src/services/ao/profiles/Profile';
import { useState } from 'react';

function CreateProjectForm({
  stateCb,
}: {
  stateCb: (p: OmphalosProject) => void;
}) {
  const [name, setName] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const fileLength = e.target.files?.length;
    let files: File[] = [];
    if (!fileLength) return;
    for (let i = 0; i < fileLength; i++) {
      const file = e.target.files?.item(i);
      if (file) files.push(file);
    }
    setFiles(files);
  }

  return <div className="flex flex-col gap-4 p-4"></div>;
}

export default CreateProjectForm;
