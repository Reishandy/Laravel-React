import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { CircleAlert, MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
}

interface IndexProps {
    flash?: {
        status?: string;
    };
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        from: number;
        to: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function Index({ flash, products }: IndexProps) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete product ${name}?`)) {
            destroy(route('products.destroy', id))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="m-4">
                <div className="flex flex-row justify-between mb-4 gap-2">
                    <Link href={route('products.create')}>
                        <Button className="h-full">Create a product</Button>
                    </Link>

                    {flash?.status && (
                        <Alert className="w-fit">
                            <CircleAlert />
                            <AlertTitle>{flash.status}</AlertTitle>
                        </Alert>
                    )}
                </div>

                <div className="mt-4">
                    <Table>
                        <TableCaption>
                            {products.data.length > 0 ? 'List of products' : 'There is nothing here'}
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {products.data.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell className="text-right">${product.price}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('products.edit', product.id)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => {handleDelete(product.id, product.name)}}
                                                    disabled={processing}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {products.last_page > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm">
                                Showing {products.from} to {products.to} of {products.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                {products.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(link.url)}
                                        disabled={!link.url}
                                        className="min-w-[40px]"
                                    >
                                        {link.label === '&laquo; Previous' ? (
                                            <ChevronLeft className="h-4 w-4" />
                                        ) : link.label === 'Next &raquo;' ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
