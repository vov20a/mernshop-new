
import { ICurrency } from '../types/ICurrency';

interface CurrencyOptionsProps {
    currencies: (ICurrency | undefined)[] | undefined;
}

const CurrenciesOptions = ({ currencies }: CurrencyOptionsProps) => {

    if (currencies?.length) {
        const content = currencies?.map((currency?: ICurrency) => {
            return (
                <option key={currency?.id} value={currency?.title}>
                    {currency?.title}
                </option>
            );
        })
        return (<>{content}</>)
    } else {
        return (
            <option ></option>
        );
    }

}
export default CurrenciesOptions