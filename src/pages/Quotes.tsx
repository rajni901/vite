import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, FileText, Image as ImageIcon, Video, Music } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
}

interface Quote {
    _id: string;
    text?: string;
    author: string;
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    category: Category;
}

const Quotes = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form state
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState<string>('');
    const [videoFile, setVideoFile] = useState<string>('');
    const [audioFile, setAudioFile] = useState<string>('');

    useEffect(() => {
        fetchQuotes();
        fetchCategories();
    }, []);

    const openWidget = (type: 'image' | 'video' | 'audio') => {
        // @ts-ignore
        const myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'dnumjy38k',
                uploadPreset: 'q8cifouw', // SHOULD BE UPDATED BY USER
                sources: ['local', 'url', 'camera', 'google_drive'],
                multiple: false,
                resourceType: type === 'image' ? 'image' : type === 'video' ? 'video' : 'auto',
                clientAllowedFormats: type === 'image' ? ['png', 'jpg', 'jpeg'] : type === 'video' ? ['mp4', 'mov'] : ['mp3', 'wav', 'm4a'],
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    console.log("Done! Here is the asset info: ", result.info);
                    if (type === 'image') setImageFile(result.info.secure_url);
                    if (type === 'video') setVideoFile(result.info.secure_url);
                    if (type === 'audio') setAudioFile(result.info.secure_url);
                }
            }
        );
        myWidget.open();
    };

    const fetchQuotes = async () => {
        const res = await api.get('/quotes');
        // Handle paginated response if necessary, but keep it simple for now
        setQuotes(Array.isArray(res.data.quotes) ? res.data.quotes : []);
    };

    const fetchCategories = async () => {
        const res = await api.get('/categories');
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
        if (data.length > 0) setCategory(data[0]._id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text && !imageFile && !videoFile && !audioFile) {
            alert('Please provide at least some content (text or media)');
            return;
        }

        const data = {
            text,
            author,
            category,
            imageUrl: imageFile,
            videoUrl: videoFile,
            audioUrl: audioFile
        };

        try {
            await api.post('/quotes', data);
            setText('');
            setAuthor('');
            setImageFile('');
            setVideoFile('');
            setAudioFile('');
            fetchQuotes();
        } catch (error) {
            console.error('Error uploading quote', error);
        }
    };

    const deleteQuote = async (id: string) => {
        if (window.confirm('Are you sure?')) {
            await api.delete(`/quotes/${id}`);
            fetchQuotes();
        }
    };

    return (
        <div>
            <h2>Manage Quotes</h2>

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px' }}>
                            {Array.isArray(categories) && categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Author</label>
                        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Text Content</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', minHeight: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="Optional text for the quote..." />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Image (Optional)</label>
                        {imageFile ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={imageFile} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} alt="Preview" />
                                <button type="button" onClick={() => setImageFile('')} style={{ fontSize: '12px', color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => openWidget('image')} style={{ width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                <ImageIcon size={16} /> Upload Image
                            </button>
                        )}
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Video (Optional)</label>
                        {videoFile ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#666' }}>Video selected</span>
                                <button type="button" onClick={() => setVideoFile('')} style={{ fontSize: '12px', color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => openWidget('video')} style={{ width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                <Video size={16} /> Upload Video
                            </button>
                        )}
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Audio (Optional)</label>
                        {audioFile ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#666' }}>Audio selected</span>
                                <button type="button" onClick={() => setAudioFile('')} style={{ fontSize: '12px', color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => openWidget('audio')} style={{ width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                <Music size={16} /> Upload Audio
                            </button>
                        )}
                    </div>
                </div>

                <button type="submit" style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Plus size={18} />
                    Upload Multi-Media Quote
                </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {Array.isArray(quotes) && quotes.map((quote) => (
                    <div key={quote._id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
                        <div style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666' }}>
                                    {quote.text && <FileText size={14} />}
                                    {quote.imageUrl && <ImageIcon size={14} />}
                                    {quote.videoUrl && <Video size={14} />}
                                    {quote.audioUrl && <Music size={14} />}
                                    MULTI-MEDIA QUOTE
                                </span>
                                <button onClick={() => deleteQuote(quote._id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {quote.text && <p style={{ fontSize: '1.1rem', margin: '10px 0' }}>"{quote.text}"</p>}
                            {quote.imageUrl && <img src={quote.imageUrl} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', margin: '10px 0' }} alt="Quote" />}
                            {quote.videoUrl && <video src={quote.videoUrl} style={{ width: '100%', height: '200px', backgroundColor: '#000', borderRadius: '4px', margin: '10px 0' }} controls />}
                            {quote.audioUrl && <audio src={quote.audioUrl} style={{ width: '100%', marginTop: '10px' }} controls />}

                            <p style={{ fontWeight: 'bold', margin: '5px 0' }}>- {quote.author}</p>
                            <span style={{ fontSize: '12px', backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '10px' }}>{quote.category?.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Quotes;
