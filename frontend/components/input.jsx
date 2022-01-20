import { h } from 'preact';

export default ({
	label, placeholder, value, onChange,
	className = 'is-radiusless',
	type = 'text', width, step,
	style = { width }, icon, button,
	parent_style, parent_field = true
}) => {

	const label_node = parent_field && label && (<label class="label">{ label }</label>);

	const input_node =
		<p class={ 'control' + (icon ? ' has-icons-left' : '') }>
			{!parent_field && label && (<label class="label">{ label }</label>)}
			<input
				class = { className && className.includes('input') ? className : 'input ' + className }
				type = { type }
				placeholder = { placeholder }
				value = { value }
				onChange = { onChange }
				style = { style }
				step = { step }
			/>
			{icon && (<span class="icon is-left"><i class={ 'fas ' + icon }></i></span>)}
		</p>;

	const button_node = parent_field && button && (<p class='control'>{ button }</p>);

	return parent_field
		? h('div', { className: 'field', ...parent_style ? { style: parent_style } : {} }, [label_node, input_node, button_node] )
		: input_node;
};