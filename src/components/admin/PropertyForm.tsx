'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, Loader2, Star, Trash2, Upload, X } from 'lucide-react';
import { AdminPanel } from '@/components/admin/AdminUI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui/components';
import { toast } from '@/components/ui/toaster';
import type { Property } from '@/types/index';
import { propertySchema, type PropertyFormData } from '@/lib/validations/index';
import { cn, DUBAI_DISTRICTS, PROPERTY_AMENITIES } from '@/lib/utils/index';

interface PropertyFormProps {
  property?: Property;
  mode: 'create' | 'edit';
}

const fieldClassName = 'border-border bg-muted/60';

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([]);
  const [uploadedImages, setUploadedImages] = useState(property?.images || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(property?.amenities || []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertyFormData>({
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
      : {
          city: 'Dubai',
          country: 'UAE',
          isActive: true,
          isFeatured: false,
          amenities: [],
          features: [],
        },
  });

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files
      .slice(0, 20 - imageFiles.length - uploadedImages.length)
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setImageFiles((previous) => [...previous, ...newFiles]);
  }, [imageFiles.length, uploadedImages.length]);

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(imageFiles[index].preview);
    setImageFiles((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  };

  const deleteUploadedImage = async (imageId: string) => {
    if (!property?.id) return;

    try {
      await fetch(`/api/properties/${property.id}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });
      setUploadedImages((previous) => previous.filter((image) => image.id !== imageId));
    } catch {
      toast({ title: 'Failed to delete image', variant: 'destructive' } as Parameters<typeof toast>[0]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((value) => value !== amenity)
        : [...previous, amenity]
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
        const response = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.error);
        propertyId = json.data.id;
      } else {
        const response = await fetch(`/api/properties/${property!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.error);
      }

      if (imageFiles.length > 0 && propertyId) {
        const base64Images = await Promise.all(imageFiles.map((item) => fileToBase64(item.file)));
        const response = await fetch(`/api/properties/${propertyId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: base64Images.map((base64) => ({ base64 })) }),
        });
        const json = await response.json();
        if (!response.ok || !json.success) {
          throw new Error(json.error || 'Image upload failed');
        }
      }

      toast({
        title: mode === 'create' ? 'Property created' : 'Property updated',
        variant: 'success',
      } as Parameters<typeof toast>[0]);
      router.push('/admin/properties');
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' } as Parameters<typeof toast>[0]);
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ name }: { name: keyof PropertyFormData }) =>
    errors[name] ? <p className="mt-1 text-xs text-destructive">{errors[name]?.message as string}</p> : null;

  const FormSection = ({
    title,
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <AdminPanel title={title} description={description} className="shadow-none">
      <div className="space-y-4">{children}</div>
    </AdminPanel>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection
        title="Basic Information"
        description="The public-facing title and descriptive copy for this property."
      >
        <div className="space-y-1.5">
          <Label>Title *</Label>
          <Input className={fieldClassName} placeholder="e.g. Luxurious 3BR Apartment in Downtown Dubai" {...register('title')} />
          <FieldError name="title" />
        </div>

        <div className="space-y-1.5">
          <Label>Description *</Label>
          <Textarea className={fieldClassName} rows={5} placeholder="Describe the property in detail..." {...register('description')} />
          <FieldError name="description" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Property Type *</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={fieldClassName}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {['apartment', 'villa', 'penthouse', 'townhouse', 'commercial', 'land'].map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="type" />
          </div>

          <div className="space-y-1.5">
            <Label>Status *</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={fieldClassName}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_sale">For Sale</SelectItem>
                    <SelectItem value="for_rent">For Rent</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Pricing & Size"
        description="Pricing and dimensions used across cards, filters, and detail pages."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Price (AED) *</Label>
            <Input className={fieldClassName} type="number" placeholder="e.g. 2500000" {...register('price', { valueAsNumber: true })} />
            <FieldError name="price" />
          </div>
          <div className="space-y-1.5">
            <Label>Area (sqft) *</Label>
            <Input className={fieldClassName} type="number" placeholder="e.g. 1200" {...register('area', { valueAsNumber: true })} />
            <FieldError name="area" />
          </div>
          <div className="space-y-1.5">
            <Label>Bedrooms</Label>
            <Input className={fieldClassName} type="number" min={0} {...register('bedrooms', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Bathrooms</Label>
            <Input className={fieldClassName} type="number" min={0} {...register('bathrooms', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Parking Spaces</Label>
            <Input className={fieldClassName} type="number" min={0} {...register('parkingSpaces', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Furnishing</Label>
            <Controller
              name="furnishing"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger className={fieldClassName}>
                    <SelectValue placeholder="Select furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furnished">Furnished</SelectItem>
                    <SelectItem value="semi_furnished">Semi Furnished</SelectItem>
                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Floor</Label>
            <Input className={fieldClassName} type="number" {...register('floor', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Year Built</Label>
            <Input className={fieldClassName} type="number" placeholder="e.g. 2022" {...register('yearBuilt', { valueAsNumber: true })} />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Location"
        description="Address details for internal reference and the public listing page."
      >
        <div className="space-y-1.5">
          <Label>Address *</Label>
          <Input className={fieldClassName} placeholder="Full address" {...register('address')} />
          <FieldError name="address" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>City *</Label>
            <Input className={fieldClassName} {...register('city')} />
          </div>
          <div className="space-y-1.5">
            <Label>District</Label>
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger className={fieldClassName}>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {DUBAI_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Country *</Label>
            <Input className={fieldClassName} {...register('country')} />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Images"
        description="Upload photography for the gallery. Strong cover imagery will improve the listing preview."
      >
        {uploadedImages.length > 0 ? (
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {uploadedImages.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image src={image.url} alt="" fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  onClick={() => deleteUploadedImage(image.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {imageFiles.length > 0 ? (
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {imageFiles.map((image, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image src={image.preview} alt="" fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-xs text-white">New</div>
              </div>
            ))}
          </div>
        ) : null}

        <label
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 p-8 transition-colors hover:border-primary/40 hover:bg-primary/5',
            imageFiles.length + uploadedImages.length >= 20 && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Drag and drop images here</p>
            <p className="text-xs text-muted-foreground">
              Or click to browse. PNG, JPG, WEBP up to 10MB each. Max 20 images.
            </p>
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

      <FormSection
        title="Amenities"
        description="Select the features that add the most value for buyers and renters."
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PROPERTY_AMENITIES.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={cn(
                'rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all',
                selectedAmenities.includes(amenity)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-muted/40 hover:border-primary/40 hover:bg-primary/5'
              )}
            >
              {selectedAmenities.includes(amenity) ? '✓ ' : ''}
              {amenity}
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection
        title="Visibility"
        description="Control whether this property is promoted or visible on the public site."
      >
        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Featured Property</p>
                <p className="text-xs text-muted-foreground">Show on the home page and featured section.</p>
              </div>
            </div>
            <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 rounded accent-primary" />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Active / Visible</p>
                <p className="text-xs text-muted-foreground">Show in search results and property listings.</p>
              </div>
            </div>
            <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded accent-primary" />
          </label>
        </div>
      </FormSection>

      <div className="panel sticky bottom-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {mode === 'create' ? 'Ready to publish this listing?' : 'Save your latest property changes'}
          </p>
          <p className="text-xs text-muted-foreground">
            Content, pricing, media uploads, and visibility settings will all be saved together.
          </p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/properties')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:opacity-95">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Saving...'}
              </>
            ) : mode === 'create' ? (
              '+ Create Property'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
