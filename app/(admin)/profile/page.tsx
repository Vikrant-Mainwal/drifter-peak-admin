"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

interface Profile {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  photo_url: string | null;
  dob: string | null;
  gender: string | null;
}

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
  setLoading(true);
  const { data: { user } } = await supabase.auth.getUser();
  console.log("user", user)
  
  if (!user) {
    setError("Not logged in");
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, phone, name, email, photo_url, dob, gender")
    .eq("id", user.id)
    .single();

  if (error) {
    setError(error.message);
  } else {
    setProfile(data);
  }
  setLoading(false);
}

  async function handleSave() {
    if (!profile) return;
    setError("");
    setSuccess("");

    if (!profile.name || profile.name.trim().length === 0) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        email: profile.email,
        dob: profile.dob,
        gender: profile.gender,
      })
      .eq("id", profile.id);
    setSaving(false);

    if (error) return setError(error.message);
    setSuccess("Profile updated");
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setError("");
    const filePath = `${profile.id}/profile.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) return setError(uploadError.message);

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // cache-bust so the new photo shows immediately instead of a cached old one
    const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ photo_url: photoUrl })
      .eq("id", profile.id);

    if (updateError) return setError(updateError.message);
    setProfile({ ...profile, photo_url: photoUrl });
  }

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Loading profile…</div>;
  }

  if (!profile) {
    return <div className="p-8 text-sm text-red-600">Could not load profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 text-xs">
          {profile.photo_url ? (
            <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            "No photo"
          )}
        </div>
        <label className="text-sm text-gray-700 cursor-pointer underline">
          Change photo
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Phone</label>
          <input
            type="text"
            value={profile.phone}
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Name *</label>
          <input
            type="text"
            value={profile.name ?? ""}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={profile.email ?? ""}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Date of birth</label>
          <input
            type="date"
            value={profile.dob ?? ""}
            onChange={e => setProfile({ ...profile, dob: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Gender</label>
          <select
            value={profile.gender ?? ""}
            onChange={e => setProfile({ ...profile, gender: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 text-black"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 mt-4">{error}</p>}
      {success && <p className="text-xs text-green-600 mt-4">{success}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40 mt-6"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}