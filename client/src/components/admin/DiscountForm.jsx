import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const DiscountFormModal = ({ open, setOpen, existing, refresh }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      code: '',
      discountPercentage: '',
      expiryDate: '',
      usageLimit: '',
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        code: existing.code,
        discountPercentage: existing.discountPercentage,
        expiryDate: existing.expiryDate?.split('T')[0],
        usageLimit: existing.usageLimit || '',
      });
    } else {
      reset({
        code: '',
        discountPercentage: '',
        expiryDate: '',
        usageLimit: '',
      });
    }
  }, [existing, reset]);

  const onSubmit = async (data) => {
    try {
      if (existing) {
        await axios.put(`/api/discounts/${existing._id}/update, data`);
        toast.success('Discount updated');
      } else {
        await axios.post('/api/discounts/create', data);
        toast.success('Discount created');
      }
      setOpen(false);
      refresh();
    } catch (err) {
      toast.error('Failed to save discount');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Discount' : 'Create Discount'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="code">Code</Label>
            <Input id="code" {...register('code', { required: true })} disabled={!!existing} placeholder="e.g., SAVE20" />
          </div>

          <div>
            <Label htmlFor="discountPercentage">Discount Percentage</Label>
            <Input id="discountPercentage" type="number" step="0.01" min="0" max="100"
              {...register('discountPercentage', { required: true })}
              placeholder="e.g., 15" />
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input id="expiryDate" type="date" {...register('expiryDate', { required: true })} />
          </div>

          <div>
            <Label htmlFor="usageLimit">Usage Limit (optional)</Label>
            <Input id="usageLimit" type="number" min="1" {...register('usageLimit')} placeholder="Leave blank for unlimited" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Discount'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountFormModal;