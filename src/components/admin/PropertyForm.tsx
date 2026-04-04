'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Upload, X, Star, Eye, EyeOff, Loader2, Plus, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components';
import { toast } from '@/components/ui/toaster';
import { propertySchema, type PropertyFormData } from '@/lib/validations/index';
import { PROPERTY_AMENITIES, DUBAI_DISTRICTS } from '@/lib/utils/index';
import { cn } from '@/lib/utils/index';
import type { Property } from '@/types/index';
import Image from 'next/image';

interface PropertyFormProps {
  property?: Property;
  mode: 'create' | 'edit';
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([]);
  const [uploadedImages, setUploadedImages] = useState(property?.images || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(property?.amenities || []);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          type: property.type,
          status: property.status,
          price: Number(property.price),
          area: Number(property.area),
          bedrooms: property.bedrooms ?? undefined,
          bathrooms: property.bathrooms ?? undefined,
          parkingSpaces: property.parkingSpaces ?? undefined,
          furnishing: property.furnishing ?? undefined,
          floor: property.floor ?? undefined,
          totalFloors: property.totalFloors ?? undefined,
          yearBuilt: property.yearBuilt ?? undefined,
          address: property.address,
          city: property.city,
          district: property.district ?? undefined,
          country: property.country,
          amenities: property.amenities,
          features: property.features,
          isFeatured: property.isFeatured,
          isActive: property.isActive,
          coverImage: property.coverImage ?? undefined,
          videoUrl: property.videoUrl ?? undefined,
        }
      : { city: 'Dubai', country: 'UAE', isActive: true, isFeatured: false, amenities: [], features: [] },
  });

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.slice(0, 20 - imageFiles.length - uploadedImages.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageFiles((prev) => [...prev, ...newFiles]);
  }, [imageFiles.length, uploadedImages.length]);

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(imageFiles[index].preview);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteUploadedImage = async (imageId: string) => {
    if (!property?.id) return;
    try {
      await fetch(`/api/properties/${property.id}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      toast({ title: 'Failed to delete image', variant: 'destructive' } as Parameters<typeof toast>[0]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    try {
      const payload = { ...data, amenities: selectedAmenities };
      let propertyId = property?.id;

      if (mode === 'create') {
        const res = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        propertyId = json.data.id;
      } else {
        const res = await fetch(`/api/properties/${property!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
      }

      // Upload new images
      if (imageFiles.length > 0 && propertyId) {
        const base64Images = await Promise.all(imageFiles.map((f) => fileToBase64(f.file)));
        const imgRes = await fetch(`/api/properties/${propertyId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: base64Images.map((base64) => ({ base64 })) }),
        });
        const imgJson = await imgRes.json();
        if (!imgJson.success) console.error('Image upload failed:', imgJson.error);
      }

      toast({ title: mode === 'create' ? '✅ Property created!' : '✅ Property updated!', variant: 'success' } as Parameters<typeof toast>[0]);
      router.push('/admin/properties');
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' } as Parameters<typeof toast>[0]);
    } finally {
      setLoading(false);
    }
  };

  const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-card rounded-xl border border-border/50 p-6 space-y-4 shadow-sm">
      <h3 className="font-display font-semibold text-base border-b border-border/50 pb-3">{title}</h3>
      {children}
    </div>
  );

  const FieldError = ({ name }: { name: keyof PropertyFormData }) =>
    errors[name] ? <p className="text-xs text-destructive mt-1">{errors[name]?.message as string}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic info */}
      <FormSection title="Basic Information">
        <div className="space-y-1.5">
          <Label>Title *</Label>
          <Input placeholder="e.g. Luxurious 3BR Apartment in Downtown Dubai" {...register('title')} />
          <FieldError name="title" />
        </div>

        <div className="space-y-1.5">
          <Label>Description *</Label>
          <Textarea rows={5} placeholder="Describe the property in detail..." {...register('description')} />
          <FieldError name="description" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Property Type *</Label>
            <Controller name="type" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {['apartment', 'villa', 'penthouse', 'townhouse', 'commercial', 'land'].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
            <FieldError name="type" />
          </div>

          <div className="space-y-1.5">
            <Label>Status *</Label>
            <Controller name="status" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="for_sale">For Sale</SelectItem>
                  <SelectItem value="for_rent">For Rent</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
        </div>
      </FormSection>

      {/* Pricing & Area */}
      <FormSection title="Pricing & Size">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Price (AED) *</Label>
            <Input type="number" placeholder="e.g. 2500000" {...register('price', { valueAsNumber: true })} />
            <FieldError name="price" />
          </div>
          <div className="space-y-1.5">
            <Label>Area (sqft) *</Label>
            <Input type="number" placeholder="e.g. 1200" {...register('area', { valueAsNumber: true })} />
            <FieldError name="area" />
          </div>
          <div className="space-y-1.5">
            <Label>Bedrooms</Label>
            <Input type="number" min={0} {...register('bedrooms', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Bathrooms</Label>
            <Input type="number" min={0} {...register('bathrooms', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Parking Spaces</Label>
            <Input type="number" min={0} {...register('parkingSpaces', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Furnishing</Label>
            <Controller name="furnishing" control={control} render={({ field }) => (
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select furnishing" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnished">Furnished</SelectItem>
                  <SelectItem value="semi_furnished">Semi Furnished</SelectItem>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="space-y-1.5">
            <Label>Floor</Label>
            <Input type="number" {...register('floor', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Year Built</Label>
            <Input type="number" placeholder="e.g. 2022" {...register('yearBuilt', { valueAsNumber: true })} />
          </div>
        </div>
      </FormSection>

      {/* Location */}
      <FormSection title="Location">
        <div className="space-y-1.5">
          <Label>Address *</Label>
          <Input placeholder="Full address" {...register('address')} />
          <FieldError name="address" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>City *</Label>
            <Input {...register('city')} />
          </div>
          <div className="space-y-1.5">
            <Label>District</Label>
            <Controller name="district" control={control} render={({ field }) => (
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {DUBAI_DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="space-y-1.5">
            <Label>Country *</Label>
            <Input {...register('country')} />
          </div>
        </div>
      </FormSection>

      {/* Images */}
      <FormSection title="Images">
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
            {uploadedImages.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
                <Image src={img.url} alt="" fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  onClick={() => deleteUploadedImage(img.id)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {imageFiles.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
            {imageFiles.map((f, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                <Image src={f.preview} alt="" fill className="object-cover" sizes="120px" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1 rounded">New</div>
              </div>
            ))}
          </div>
        )}

        <label className={cn(
          'border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-accent transition-colors',
          imageFiles.length + uploadedImages.length >= 20 && 'opacity-50 cursor-not-allowed'
        )}>
          <Upload className="w-6 h-6 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload images</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB each. Max 20 images.</p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={imageFiles.length + uploadedImages.length >= 20}
            onChange={handleImageSelect}
          />
        </label>
      </FormSection>

      {/* Amenities */}
      <FormSection title="Amenities">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PROPERTY_AMENITIES.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all',
                selectedAmenities.includes(amenity)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              )}
            >
              {selectedAmenities.includes(amenity) && '✓ '}{amenity}
            </button>
          ))}
        </div>
      </FormSection>

      {/* Settings */}
      <FormSection title="Settings">
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded accent-primary" />
            <div>
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Star className="w-4 h-4 text-gold-500" /> Featured Property
              </p>
              <p className="text-xs text-muted-foreground">Show on home page and featured section</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded accent-primary" />
            <div>
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-500" /> Active / Visible
              </p>
              <p className="text-xs text-muted-foreground">Show in search results and listings</p>
            </div>
          </label>
        </div>
      </FormSection>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="gold" disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {mode === 'create' ? 'Creating...' : 'Saving...'}</>
          ) : (
            mode === 'create' ? '+ Create Property' : '✓ Save Changes'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/properties')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
