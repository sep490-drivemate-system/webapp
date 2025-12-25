"use client";
import { useState } from "react";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { uploadFileWithMeta, createProfile } from "@/features/upload/uploadThunks";
import { test } from "@/features/auth/authThunk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TestDto } from "@/types/test";

export default function UploadDemoPage() {
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Test demo states
    const [cccdmtFile, setCccdmtFile] = useState<File | null>(null);
    const [cccdmsFile, setCccdmsFile] = useState<File | null>(null);
    const [cccdmt, setCccdmt] = useState("");
    const [cccdms, setCccdms] = useState("");

    const { runSafe: runUpload, loading: uploading } = useThunkAction(uploadFileWithMeta);
    const { runSafe: runCreateProfile, loading: creating } = useThunkAction(createProfile);
    const { runSafe: runTest, loading: testing } = useThunkAction(test);

    const handleUpload = async () => {
        if (!file) return alert("Vui lòng chọn file");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);
        formData.append("meta", JSON.stringify({ tags: ["demo", "image"] }));
        const res = await runUpload(formData);
        if (res.ok) {
            alert(`Upload thành công: ${res.data.value?.url || "(xem console)"}`);
            console.log("Upload response:", res.data);
        } else {
            console.error(res.error);
            alert("Upload thất bại");
        }
    };

    const handleCreateProfile = async () => {
        const res = await runCreateProfile({ name, email });
        if (res.ok) {
            alert(`Tạo profile thành công: ${res.data.value?.id || "(xem console)"}`);
            console.log("Create profile response:", res.data);
        } else {
            console.error(res.error);
            alert("Tạo profile thất bại");
        }
    };

    const handleTestDemo = async () => {
        if (!cccdmtFile || !cccdmsFile) {
            alert("Vui lòng chọn cả 2 file CCCD");
            return;
        }

        if (!cccdmt || !cccdms) {
            alert("Vui lòng nhập số CCCD");
            return;
        }

        const testData: TestDto = {
            testccdmat: {
                cccdmt: parseInt(cccdmt),
                formFilecccd: cccdmtFile
            },
            testccdmas: {
                cccdms: parseInt(cccdms),
                formFilecccdms: cccdmsFile
            }
        };

        const res = await runTest(testData);
        if (res.ok) {
            alert("Test thành công! (xem console)");
            console.log("Test response:", res.data);
        } else {
            console.error(res.error);
            alert("Test thất bại");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid md:grid-cols-3 gap-6">
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

                <Card>
                    <CardHeader>
                        <CardTitle>Test Demo (TestDto)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">CCCD Mặt trước:</label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCccdmtFile(e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <Input
                            placeholder="Số CCCD mặt trước"
                            value={cccdmt}
                            onChange={(e) => setCccdmt(e.target.value)}
                            type="number"
                        />
                        <div>
                            <label className="text-sm font-medium">CCCD Mặt sau:</label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCccdmsFile(e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <Input
                            placeholder="Số CCCD mặt sau"
                            value={cccdms}
                            onChange={(e) => setCccdms(e.target.value)}
                            type="number"
                        />
                        <Button onClick={handleTestDemo} disabled={testing}>
                            {testing ? "Đang test..." : "Test Demo"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


