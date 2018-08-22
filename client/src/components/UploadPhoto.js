import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Upload, UploadSubscription } from '../containers/upload';


class UploadInner extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            file: null,
            imagePreview: null
        }
    }

    handleChange({ target: { validity, files: [file] } }) {
        if (FileReader) {
            var fr = new FileReader();
            fr.onloadend = () => {
                this.setState({
                    file: file,
                    valid: validity.valid,
                    imagePreview: fr.result
                });
            };

            fr.readAsDataURL(file)
        }
    }


    handleSubmit() {
        this.props.mutation({ variables: { image: this.state.file, caption: 'Nero', private: false } });
    }

    render() {
        let { imagePreview } = this.state;
        let $imagePreview = null;
        if (imagePreview) {
            $imagePreview = (<img height="800" width="800" src={imagePreview} />);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }
        if (this.props.loading) return <div>Loading...</div>;
        if (this.props.error) return <div>Error :(</div>;
        return (
            <div>
                <input type="file" required onChange={this.handleChange} />
                <input type="checkbox" />
                <input type="submit" value="Submit" onClick={this.handleSubmit} disabled={!this.state.valid} />
                <div className="imgPreview">
                    {$imagePreview}
                </div>
            </div>)
    }
}

UploadInner.propTypes = {
    file: propTypes.object,
    caption: propTypes.string.isRequired,
    privatePhoto: propTypes.bool.isRequired,
}

UploadInner.defaultProps = {
    caption: 'Nero',
    privatePhoto: true,
};

export const renderUpload = (uploadPhoto, { loading, error }) => {
    return (
        <UploadInner mutation={uploadPhoto} loading={loading} error={error}>
        </UploadInner>)
};

const UploadPhotoMutation = () => <Upload>{renderUpload}</Upload>;

const UploadPhoto = () => <UploadSubscription>{UploadPhotoMutation}</UploadSubscription>;

export default UploadPhoto;