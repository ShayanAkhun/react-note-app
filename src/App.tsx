import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { NewNote } from './NewNote'
import { useLocalStorage } from './useLocalStorage'
import { v4 as uuidV4 } from 'uuid'
import { Prev } from "react-bootstrap/esm/PageItem"
import { NoteLists } from "./NoteLists"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"


export type Note = {
  id: string
} & NoteData

export type RawNotes = {
  id: string
} & RawNoteData


export type RawNoteData = {
  title: string
  markDown: string
  tagIds: string[]
}
export type NoteData = {
  title: string
  markDown: string
  tags: Tags[]
}

export type Tags = {
  id: string
  label: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNotes[]>('NOTES', [])
  const [tags, setTags] = useLocalStorage<Tags[]>('TAGS', [])


  // this line of code says , Hey loop through all my different notes and for each one of them 
  // i want to keep all the info about the notes and tags and id's associatew ith it

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])


  // WHen we create a note and call this function its going to save which will save in the notes inside local storage
  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })

  }
  // this will add new tags

  function addTag(tag: Tags) {
    setTags(prev => [...prev, tag])

  }

  // this will update a note when a previous note is edited ......hopefully
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) { return { ...note, ...data, tagIds: tags.map(tag => tag.id) } } else { return note }
      })

    })
  }

  // This will delete a note on a button press
  function onDelete(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  // THis block of code will probably hopefull update a new tag to the modal
  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  // deletes a update tag
  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tags => tags.id !== id)
    })
  }





  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteLists notes={notesWithTags} availableTags={tags} onUpdateTag={updateTag} onDeleteTag={deleteTag} />}></Route>
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />}></Route>
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDelete} />}></Route>
          <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />}></Route>
        </Route>
        <Route path="/*" element={<Navigate to="/" />}></Route>
      </Routes>
    </Container>
  )
}

export default App
