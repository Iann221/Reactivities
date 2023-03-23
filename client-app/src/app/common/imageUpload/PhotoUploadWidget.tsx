import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto}: Props) {
    const [files, setFiles] = useState<any>([]);   
    const [cropper, setCropper] = useState<Cropper>();

    // function bikinan sendiri isinya what to do when we crop our image
    function onCrop() {
        if(cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    // untuk bersihin memory(files) kalo udah beres dipake
    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }   
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo'></Header>
                <PhotoWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image'></Header>
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview & Upload'></Header>
                {files && files.length>0 &&
                    <>
                    <div className="img-preview" style={{minHeight: 200, overflow:'hidden'}}/>
                    <Button.Group widths={2}>
                        <Button loading={loading} onClick={onCrop} positive icon='check'/>
                        <Button disabled={loading} onClick={() => setFiles([])} icon='close'/>
                    </Button.Group>
                    </>
                }
            </Grid.Column>
        </Grid>
    )
}