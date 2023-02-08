import { NoteData, Tags } from "./App";
import { NoteForm } from "./NoteForm";


type NewNoteProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tags) => void
    availableTags: Tags[]
}

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
    return <>
        <h1 className="mb-4">New Note </h1>
        <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
    </>
}