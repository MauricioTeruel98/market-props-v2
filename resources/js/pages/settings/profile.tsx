import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración del perfil',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    facebook: string;
    twitter: string;
    instagram: string;
    whatsapp: string;
    avatar: File | null;
    cover_image: File | null;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name || '',
        email: auth.user.email || '',
        phone: auth.user.phone || '',
        address: auth.user.address || '',
        city: auth.user.city || '',
        state: auth.user.state || '',
        facebook: auth.user.facebook || '',
        twitter: auth.user.twitter || '',
        instagram: auth.user.instagram || '',
        whatsapp: auth.user.whatsapp || '',
        avatar: null,
        cover_image: null,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setAvatarPreview(null);
                setCoverPreview(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración del perfil" />

            <SettingsLayout>
                <div className="space-y-8">
                    <HeadingSmall 
                        title="Información del perfil" 
                        description="Actualiza tu información personal y configuración de cuenta" 
                    />

                    <form onSubmit={submit} className="space-y-8">
                        {/* Información básica */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información básica</CardTitle>
                                <CardDescription>
                                    Tu nombre y dirección de correo electrónico
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre completo</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Tu nombre completo"
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Dirección de correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="tu@email.com"
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        className="mt-1 block w-full"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        autoComplete="tel"
                                        placeholder="+34 600 000 000"
                                    />
                                    <InputError className="mt-2" message={errors.phone} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dirección */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dirección</CardTitle>
                                <CardDescription>
                                    Tu información de ubicación
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Textarea
                                        id="address"
                                        className="mt-1 block w-full"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Calle, número, piso..."
                                        rows={3}
                                    />
                                    <InputError className="mt-2" message={errors.address} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">Ciudad</Label>
                                        <Input
                                            id="city"
                                            className="mt-1 block w-full"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Madrid"
                                        />
                                        <InputError className="mt-2" message={errors.city} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="state">Provincia/Estado</Label>
                                        <Input
                                            id="state"
                                            className="mt-1 block w-full"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            placeholder="Madrid"
                                        />
                                        <InputError className="mt-2" message={errors.state} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Redes sociales */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Redes sociales</CardTitle>
                                <CardDescription>
                                    Enlaces a tus perfiles en redes sociales
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input
                                        id="facebook"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.facebook}
                                        onChange={(e) => setData('facebook', e.target.value)}
                                        placeholder="https://facebook.com/tu-usuario"
                                    />
                                    <InputError className="mt-2" message={errors.facebook} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="twitter">Twitter/X</Label>
                                    <Input
                                        id="twitter"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.twitter}
                                        onChange={(e) => setData('twitter', e.target.value)}
                                        placeholder="https://twitter.com/tu-usuario"
                                    />
                                    <InputError className="mt-2" message={errors.twitter} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.instagram}
                                        onChange={(e) => setData('instagram', e.target.value)}
                                        placeholder="https://instagram.com/tu-usuario"
                                    />
                                    <InputError className="mt-2" message={errors.instagram} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        type="tel"
                                        className="mt-1 block w-full"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        placeholder="+54 9 11 1234-5678"
                                    />
                                    <InputError className="mt-2" message={errors.whatsapp} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Imágenes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Imágenes del perfil</CardTitle>
                                <CardDescription>
                                    Tu foto de perfil y imagen de portada
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar */}
                                <div className="space-y-4">
                                    <Label>Foto de perfil</Label>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage 
                                                src={avatarPreview || (auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined)} 
                                                alt="Avatar del usuario" 
                                            />
                                            <AvatarFallback className="text-lg">
                                                {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <Input
                                                id="avatar"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="max-w-xs"
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                JPG, PNG o GIF. Máximo 2MB.
                                            </p>
                                        </div>
                                    </div>
                                    <InputError className="mt-2" message={errors.avatar as string} />
                                </div>

                                <Separator />

                                {/* Cover Image */}
                                <div className="space-y-4">
                                    <Label>Imagen de portada</Label>
                                    <div className="space-y-4">
                                        {(coverPreview || auth.user.cover_image) && (
                                            <div className="relative">
                                                <img
                                                    src={coverPreview || `/storage/${auth.user.cover_image}`}
                                                    alt="Imagen de portada"
                                                    className="h-32 w-full rounded-lg object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Input
                                                id="cover_image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverChange}
                                                className="max-w-xs"
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                JPG, PNG o GIF. Máximo 2MB.
                                            </p>
                                        </div>
                                    </div>
                                    <InputError className="mt-2" message={errors.cover_image as string} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Verificación de email */}
                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Verificación de email</CardTitle>
                                    <CardDescription>
                                        Tu dirección de correo electrónico no está verificada
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Tu dirección de correo electrónico no está verificada.{' '}
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Haz clic aquí para reenviar el email de verificación.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="text-sm font-medium text-green-600">
                                            Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Botones de acción */}
                        <div className="flex items-center gap-4">
                            <Button disabled={processing} type="submit">
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">¡Guardado exitosamente!</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
