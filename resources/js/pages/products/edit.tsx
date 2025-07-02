import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';

interface Product {
    id: number
    name: string;
    price: number;
    description?: string;
}

interface EditProp {
    product: Product
}

type ProductForm = {
    name: string;
    price: string;
    description: string;
};

export default function Edit({ product }: EditProp) {
    const { data, setData, put, processing, errors } = useForm<Required<ProductForm>>( {
        name: product.name,
        price: product.price,
        description: product.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: '/products',
        },
        {
            title: 'Edit a product',
            href: `/products/${product.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="w-8/12 p-4">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="product_name">Name</Label>
                        <Input
                            placeholder="Product Name"
                            className="my-2"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        ></Input>
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="product_price">Price</Label>
                        <Input placeholder="Price" className="my-2" value={data.price} onChange={(e) => setData('price', e.target.value)}></Input>
                        <InputError message={errors.price} />
                    </div>

                    <div>
                        <Label htmlFor="product_description">Description</Label>
                        <Textarea
                            placeholder="Description"
                            className="my-2"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        ></Textarea>
                        <InputError message={errors.description} />
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Edit
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
