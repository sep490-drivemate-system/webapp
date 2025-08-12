"use client";
import { useState } from "react";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { uploadFileWithMeta, createProfile } from "@/features/upload/uploadThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadDemoPage() {
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const { runSafe: runUpload, loading: uploading } = useThunkAction(uploadFileWithMeta);
    const { runSafe: runCreateProfile, loading: creating } = useThunkAction(createProfile);

    const handleUpload = async () => {
        if (!file) return alert("Vui lòng chọn file");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);
        formData.append("meta", JSON.stringify({ tags: ["demo", "image"] }));
        const res = await runUpload(formData);
        if (res.ok) {
            alert(`Upload thành công: ${(res.data as any).data?.url || (res.data as any).url || "(xem console)"}`);
            // eslint-disable-next-line no-console
            console.log("Upload response:", res.data);
        } else {
            // eslint-disable-next-line no-console
            console.error(res.error);
            alert("Upload thất bại");
        }
    };

    const handleCreateProfile = async () => {
        const res = await runCreateProfile({ name, email });
        if (res.ok) {
            alert(`Tạo profile thành công: ${(res.data as any).data?.id || (res.data as any).id || "(xem console)"}`);
            // eslint-disable-next-line no-console
            console.log("Create profile response:", res.data);
        } else {
            // eslint-disable-next-line no-console
            console.error(res.error);
            alert("Tạo profile thất bại");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload ảnh (multipart/form-data)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                        <Input placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
                        <Button onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Đang upload..." : "Upload"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Gửi JSON (application/json)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Button onClick={handleCreateProfile} disabled={creating}>
                            {creating ? "Đang tạo..." : "Tạo profile"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


