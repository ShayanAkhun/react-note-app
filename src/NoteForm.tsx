import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from 'react-select/creatable'
import { NoteData, Tags } from "./App";
import { v4 as uuidV4 } from 'uuid'


type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tags) => void
    availableTags: Tags[]
} & Partial<NoteData>



export function NoteForm({ onSubmit, onAddTag, availableTags, title = "", markDown = "", tags = [] }: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const markDownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tags[]>(tags)
    const navigate = useNavigate()

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        onSubmit({
            title: titleRef.current!.value,
            markDown: markDownRef.current!.value,
            tags: selectedTags
        })
        navigate("..")
    }


    return <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control required ref={titleRef} defaultValue={title} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <CreatableReactSelect isMulti value={selectedTags.map(tag => {
                            return { label: tag.label, value: tag.id }
                        })}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return { label: tag.label, id: tag.value }
                                }))
                            }}
                            onCreateOption={label => {
                                const newTag = { id: uuidV4(), label }
                                onAddTag(newTag)
                                setSelectedTags(prev => [...prev, newTag])
                            }}
                            options={availableTags.map(tag => {
                                return {
                                    label: tag.label, value: tag.id
                                }
                            })}

                        />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="markDown">
                <Form.Label>Body</Form.Label>
                <Form.Control required as='textarea' rows={15} ref={markDownRef} defaultValue={markDown} />
            </Form.Group>
            <Stack direction="horizontal" gap={2} className="justify-content-end">
                <Button type="submit" variant="primary">Save</Button>

                {/* handles goBack navigation similar to react native */}
                <Link to="..">
                    <Button type="button" variant="outline-secondary">Cancel</Button>
                </Link>

            </Stack>
        </Stack>
    </Form>
}