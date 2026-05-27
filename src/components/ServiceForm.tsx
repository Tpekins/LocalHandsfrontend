import React from 'react';
import { Service } from '../types';
import { Input, Button } from 'antd';

interface ServiceFormProps {
  service?: Service;
  onSave: (data: Partial<Service>) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel, readOnly }) => {
  const [form] = Input.useForm?.() || [null];

  React.useEffect(() => {
    if (form && service) {
      form.setFieldsValue(service);
    }
  }, [service, form]);

  const handleFinish = (values: any) => {
    onSave(values);
  };

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (form) form.submit();
        }}
      >
        <Input
          name="title"
          defaultValue={service?.title}
          placeholder="Service Title"
          disabled={readOnly}
        />
        <Input
          name="providerName"
          defaultValue={service?.providerName}
          placeholder="Provider Name"
          disabled={readOnly}
        />
        <Input
          name="category"
          defaultValue={service?.category?.name}
          placeholder="Category"
          disabled={readOnly}
        />
        <Input
          name="price"
          defaultValue={service?.price}
          placeholder="Price"
          type="number"
          disabled={readOnly}
        />
        <Input
          name="rating"
          defaultValue={service?.rating}
          placeholder="Rating"
          type="number"
          disabled={readOnly}
        />
        {!readOnly && (
          <Button htmlType="submit" type="primary">
            Save
          </Button>
        )}
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          {readOnly ? 'Close' : 'Cancel'}
        </Button>
      </form>
    </div>
  );
};

export default ServiceForm;
