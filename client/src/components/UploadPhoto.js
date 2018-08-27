import React, { Component } from 'react';
import propTypes from 'prop-types';
import Upload from '../containers/upload';


class UploadInner extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            file: null,
            imagePreview: null,
            privatePhoto: false,
            caption: ''
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
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    handleSubmit() {
        this.props.mutation({ variables: { image: this.state.file, caption: this.state.caption, private: this.state.privatePhoto } });
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
                <input name="file" type="file" required onChange={this.handleChange} />
                <input name="caption" type="text" value={this.state.caption} onChange={this.handleInputChange} />
                <input name="privatePhoto" type="checkbox" value={this.state.privatePhoto} onChange={this.handleInputChange} />
                <input type="submit" value="Submit" onClick={this.handleSubmit} disabled={!this.state.valid} />
                {/* <div className="imgPreview">
                    {$imagePreview}
                </div> */}
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

export default () => <Upload>{(mutation, { loading, error }) => <UploadInner mutation={mutation} error={error} loading={loading} />}</Upload>;

//const UploadPhoto = () => <UploadSubscription>{UploadPhotoMutation}</UploadSubscription>;
