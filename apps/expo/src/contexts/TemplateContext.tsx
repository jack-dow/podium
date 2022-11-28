import { useContext } from 'react';

interface TemplateContextProps {
  id: string;
}

const TemplateContext = useContext<TemplateContextProps>();
