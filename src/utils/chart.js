import { Pie , Column } from '@antv/g2plot';


export function PieDraw(divId , data , content){
	return new Pie(divId, {
		  appendPadding: 10,
		  data,
		  angleField: 'value',
		  colorField: 'type',
		  radius: 1,
		  innerRadius: 0.6,
		  label: {
			type: 'inner',
			offset: '-50%',
			content: '{value}',
			style: {
			  textAlign: 'center',
			  fontSize: 14,
			},
		  },
		  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
		  statistic: {
			title: false,
			content: {
			  style: {
				whiteSpace: 'pre-wrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			  },
			  content,
			},
		  },
	})
}

export function ColumnDraw (divId , data , content){
	return new Column(divId, {
	  data,
	  xField: 'type',
	  yField: 'value',
	  label: {
	    // 可手动配置 label 数据标签位置
	    position: 'middle', // 'top', 'bottom', 'middle',
	    // 配置样式
	    style: {
	      fill: '#FFFFFF',
	      opacity: 0.6,
	    },
	  },
	  xAxis: {
	    label: {
	      autoHide: true,
	      autoRotate: false,
	    },
	  },
	  meta: {
	    type: {
	      alias: '类别',
	    },
	    sales: {
	      alias: '销售额',
	    },
	  },
	  statistic: {
	  			title: false,
	  			content: {
	  			  style: {
	  				whiteSpace: 'pre-wrap',
	  				overflow: 'hidden',
	  				textOverflow: 'ellipsis',
	  			  },
	  			  content,
	  			},
	  },
	});
}